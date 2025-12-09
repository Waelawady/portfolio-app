CREATE TABLE `costBreakdowns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`category` varchar(100) NOT NULL,
	`amount` int NOT NULL,
	`isPaid` int NOT NULL DEFAULT 1,
	`paymentDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `costBreakdowns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `futureExpenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`expenseType` varchar(100) NOT NULL,
	`amount` int NOT NULL,
	`paymentDate` timestamp,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `futureExpenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hoursData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`month` varchar(20) NOT NULL,
	`hours` int NOT NULL,
	`isForecast` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hoursData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`invoiceNumber` varchar(50) NOT NULL,
	`amount` int NOT NULL,
	`submissionDate` timestamp,
	`status` enum('paid','unpaid','submitted','to_submit') NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`portfolioFileKey` varchar(500),
	`portfolioFileUrl` text,
	`format` enum('html','pptx','pdf') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectName` varchar(255) NOT NULL,
	`projectCode` varchar(100),
	`clientName` varchar(255),
	`projectManager` varchar(255),
	`contractValue` int NOT NULL,
	`baselineBudget` int NOT NULL,
	`baselineGPM` int NOT NULL,
	`workingBudget` int NOT NULL,
	`currentGPM` int NOT NULL,
	`actualCosts` int NOT NULL,
	`projectProgress` int NOT NULL,
	`dashboardFileKey` varchar(500),
	`dashboardFileUrl` text,
	`databaseFileKey` varchar(500),
	`databaseFileUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
