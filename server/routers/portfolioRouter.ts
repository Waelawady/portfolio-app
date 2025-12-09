import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { getPortfolioData } from '../portfolioGenerator';
import { generateAllSlides } from '../slideGenerator';
import * as path from 'path';
import * as fs from 'fs/promises';

export const portfolioRouter = router({
  // Generate portfolio for a project
  generate: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Get portfolio data
      const data = await getPortfolioData(input.projectId);
      
      // Verify ownership
      if (data.project.userId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      // Generate slides
      const outputDir = path.join('/tmp', `portfolio-${input.projectId}-${Date.now()}`);
      const slideFiles = await generateAllSlides(data, outputDir);
      
      // Return the index page URL
      const indexPath = path.join(outputDir, 'index.html');
      
      return {
        success: true,
        portfolioPath: outputDir,
        indexPath,
        slideCount: slideFiles.length,
      };
    }),
  
  // Get portfolio data for preview
  getData: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await getPortfolioData(input.projectId);
      
      // Verify ownership
      if (data.project.userId !== ctx.user.id) {
        throw new Error('Unauthorized');
      }
      
      return data;
    }),
});
