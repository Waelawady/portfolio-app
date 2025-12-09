# Project Portfolio Generator - TODO

## Core Features

- [x] File upload system for dashboard PDF and database files
- [x] PDF data extraction module (baseline budget, working budget, contract value, GPM, costs)
- [x] Database file parser (Excel/CSV support for detailed project data)
- [x] Forecast data entry form (future invoices, expenses, hours)
- [x] Portfolio generation engine with 12-slide template
- [ ] Chart generation (Chart.js integration for financial visualizations)
- [ ] Export functionality (PPTX, PDF, online view)
- [ ] Project data storage and management

## Slide Templates (12 slides)

- [ ] Slide 1: Title/Cover page with current GPM vs baseline
- [ ] Slide 2: Project Overview with current, projected, and baseline GPM
- [ ] Slide 3: Cash Position & Collection Status
- [ ] Slide 4: Invoice Tracking & Status
- [ ] Slide 5: Hours Consumption Analysis with average hourly rate
- [ ] Slide 6: Cash Flow Visualization
- [ ] Slide 7: Cost Breakdown & Management
- [ ] Slide 8: Cost Structure Analysis
- [ ] Slide 9: Profitability Analysis (three-tier budget)
- [ ] Slide 10: Budget Evolution & Variance Analysis
- [ ] Slide 11: Risk Assessment & Mitigation
- [ ] Slide 12: Closing slide

## Data Processing

- [ ] PDF text extraction and parsing logic
- [ ] Excel/CSV file reading and data mapping
- [ ] Financial calculations (GPM, variances, projections)
- [ ] Budget tier analysis (baseline, current, forecast)
- [ ] Hours consumption tracking and forecasting
- [ ] Invoice status tracking and cash flow calculations

## User Interface

- [x] Landing page with feature overview
- [x] File upload interface with drag-and-drop
- [x] Data extraction preview/verification screen
- [x] Forecast data entry form with dynamic fields
- [x] Portfolio preview interface
- [ ] Export options and download functionality
- [x] Project history and management dashboard

## Technical Infrastructure

- [x] Database schema for projects and generated portfolios
- [x] File storage integration for uploaded files
- [ ] Background job processing for portfolio generation
- [ ] Error handling and validation
- [x] User authentication and project ownership
- [x] API endpoints for all operations
