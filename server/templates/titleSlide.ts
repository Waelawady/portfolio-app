import { PortfolioData } from '../portfolioGenerator';

export function generateTitleSlide(data: PortfolioData): string {
  const { project, calculations } = data;
  const currentGPM = (calculations.currentGPM / 100).toFixed(2);
  const baselineGPM = (calculations.baselineGPM / 100).toFixed(2);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.projectName} - Financial Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .slide-container {
            width: 1280px;
            height: 720px;
            background: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px;
            text-align: center;
        }
        .title {
            font-size: 48px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 20px;
            line-height: 1.2;
        }
        .subtitle {
            font-size: 32px;
            color: #4a5568;
            margin-bottom: 40px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            width: 100%;
            max-width: 900px;
            margin-top: 40px;
        }
        .metric-box {
            background: #f7fafc;
            padding: 25px;
            border-radius: 12px;
            border-left: 4px solid #667eea;
        }
        .metric-label {
            font-size: 14px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
        }
        .metric-sub {
            font-size: 13px;
            color: #4a5568;
            margin-top: 5px;
        }
        .gpm-highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            border-radius: 50px;
            font-size: 18px;
            margin-top: 30px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="title">${project.projectName}</div>
        <div class="subtitle">${project.clientName || 'Financial Portfolio'}</div>
        
        <div class="metrics">
            <div class="metric-box">
                <div class="metric-label">Contract Value</div>
                <div class="metric-value">QAR ${(calculations.contractValue / 1000).toFixed(1)}M</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Project Code</div>
                <div class="metric-value">${project.projectCode || 'N/A'}</div>
            </div>
            <div class="metric-box">
                <div class="metric-label">Project Progress</div>
                <div class="metric-value">${(project.projectProgress / 100).toFixed(1)}%</div>
            </div>
        </div>
        
        <div class="gpm-highlight">
            <strong>Current GPM: ${currentGPM}%</strong>
            <br>
            <span style="font-size: 14px; opacity: 0.9;">vs Baseline: ${baselineGPM}%</span>
        </div>
    </div>
</body>
</html>
  `.trim();
}
