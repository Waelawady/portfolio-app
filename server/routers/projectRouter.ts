import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import * as db from '../db';
import { parseDashboardPDF } from '../pdfParser';
import { parseDatabaseFile } from '../excelParser';
import { uploadFileToS3 } from '../fileUpload';

export const projectRouter = router({
  // Create a new project with uploaded files
  create: protectedProcedure
    .input(z.object({
      dashboardFile: z.object({
        buffer: z.string(), // base64 encoded
        originalname: z.string(),
        mimetype: z.string(),
      }),
      databaseFile: z.object({
        buffer: z.string(), // base64 encoded
        originalname: z.string(),
        mimetype: z.string(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Parse dashboard PDF
      const dashboardBuffer = Buffer.from(input.dashboardFile.buffer, 'base64');
      const dashboardData = await parseDashboardPDF(dashboardBuffer);
      
      // Upload dashboard file to S3
      const dashboardUpload = await uploadFileToS3(
        {
          buffer: dashboardBuffer,
          originalname: input.dashboardFile.originalname,
          mimetype: input.dashboardFile.mimetype,
        } as Express.Multer.File,
        ctx.user.id,
        'dashboard'
      );
      
      // Create project
      const projectId = await db.createProject({
        userId: ctx.user.id,
        projectName: dashboardData.projectName,
        projectCode: dashboardData.projectCode,
        clientName: dashboardData.clientName,
        projectManager: dashboardData.projectManager,
        contractValue: dashboardData.contractValue,
        baselineBudget: dashboardData.baselineBudget,
        baselineGPM: dashboardData.baselineGPM,
        workingBudget: dashboardData.workingBudget,
        currentGPM: dashboardData.currentGPM,
        actualCosts: dashboardData.actualCosts,
        projectProgress: dashboardData.projectProgress,
        dashboardFileKey: dashboardUpload.fileKey,
        dashboardFileUrl: dashboardUpload.fileUrl,
      });
      
      // Parse and save database file if provided
      if (input.databaseFile) {
        const databaseBuffer = Buffer.from(input.databaseFile.buffer, 'base64');
        const databaseData = await parseDatabaseFile(databaseBuffer);
        
        // Upload database file to S3
        const databaseUpload = await uploadFileToS3(
          {
            buffer: databaseBuffer,
            originalname: input.databaseFile.originalname,
            mimetype: input.databaseFile.mimetype,
          } as Express.Multer.File,
          ctx.user.id,
          'database'
        );
        
        // Update project with database file info
        // (Would need an update function, but for now we'll save the related data)
        
        // Save cost breakdowns
        if (databaseData.costs.length > 0) {
          await db.saveCostBreakdowns(
            databaseData.costs.map(cost => ({
              projectId,
              category: cost.category,
              amount: cost.amount,
              isPaid: cost.isPaid ? 1 : 0,
              paymentDate: cost.paymentDate,
              notes: cost.notes,
            }))
          );
        }
        
        // Save hours data
        if (databaseData.hours.length > 0) {
          await db.saveHoursData(
            databaseData.hours.map(hour => ({
              projectId,
              month: hour.month,
              hours: hour.hours,
              isForecast: hour.isForecast ? 1 : 0,
            }))
          );
        }
      }
      
      return { projectId };
    }),
  
  // Get user's projects
  list: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.getUserProjects(ctx.user.id);
    }),
  
  // Get project details
  get: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const project = await db.getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error('Project not found');
      }
      
      const costs = await db.getProjectCosts(input.projectId);
      const hours = await db.getProjectHours(input.projectId);
      const invoices = await db.getProjectInvoices(input.projectId);
      const expenses = await db.getProjectExpenses(input.projectId);
      
      return {
        project,
        costs,
        hours,
        invoices,
        expenses,
      };
    }),
  
  // Add forecast data (invoices and expenses)
  addForecast: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      invoices: z.array(z.object({
        invoiceNumber: z.string(),
        amount: z.number(),
        submissionDate: z.string().optional(),
        status: z.enum(['paid', 'unpaid', 'submitted', 'to_submit']),
        notes: z.string().optional(),
      })),
      expenses: z.array(z.object({
        expenseType: z.string(),
        amount: z.number(),
        paymentDate: z.string().optional(),
        description: z.string().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify project ownership
      const project = await db.getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error('Project not found');
      }
      
      // Save invoices
      if (input.invoices.length > 0) {
        await db.saveInvoices(
          input.invoices.map(inv => ({
            projectId: input.projectId,
            invoiceNumber: inv.invoiceNumber,
            amount: inv.amount,
            submissionDate: inv.submissionDate ? new Date(inv.submissionDate) : undefined,
            status: inv.status,
            notes: inv.notes,
          }))
        );
      }
      
      // Save expenses
      if (input.expenses.length > 0) {
        await db.saveFutureExpenses(
          input.expenses.map(exp => ({
            projectId: input.projectId,
            expenseType: exp.expenseType,
            amount: exp.amount,
            paymentDate: exp.paymentDate ? new Date(exp.paymentDate) : undefined,
            description: exp.description,
          }))
        );
      }
      
      return { success: true };
    }),
});
