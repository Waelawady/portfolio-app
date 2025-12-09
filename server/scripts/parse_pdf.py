#!/usr/bin/env python3
import sys
import json
import re
from pypdf import PdfReader

def extract_number(text, pattern):
    """Extract number from text using regex pattern"""
    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
    if not match:
        return 0
    value = match.group(1).replace(',', '')
    try:
        return round(float(value))
    except:
        return 0

def extract_percentage(text, pattern):
    """Extract percentage and convert to integer (31.00% = 3100)"""
    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
    if not match:
        return 0
    try:
        value = float(match.group(1))
        return round(value * 100)
    except:
        return 0

def extract_text_field(text, pattern):
    """Extract text field using regex pattern"""
    match = re.search(pattern, text, re.IGNORECASE)
    if not match:
        return ""
    return match.group(1).strip()

def parse_dashboard_pdf(pdf_path):
    """Parse dashboard PDF and extract key metrics"""
    reader = PdfReader(pdf_path)
    
    # Extract all text from PDF
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() + "\n"
    
    # Extract data using patterns
    data = {
        "projectName": extract_text_field(full_text, r"Project Name:\s*([^\n]+)"),
        "projectCode": extract_text_field(full_text, r"Project Code:\s*([^\n]+)") or extract_text_field(full_text, r"\((\d+)\)"),
        "clientName": extract_text_field(full_text, r"Client Name:\s*([^\n]+)"),
        "projectManager": extract_text_field(full_text, r"Project Manager:\s*([^\n]+)"),
        "contractValue": extract_number(full_text, r"(?:Latest Contract Fee|Contract Value)[\s\S]*?(\d+(?:,\d{3})*(?:\.\d+)?)"),
        "baselineBudget": extract_number(full_text, r"Baseline Budget[\s\S]*?(\d+(?:,\d{3})*(?:\.\d+)?)"),
        "baselineGPM": extract_percentage(full_text, r"Baseline.*?GPM[\s\S]*?(\d+(?:\.\d+)?)\s*%"),
        "workingBudget": extract_number(full_text, r"Working Budget[\s\S]*?(\d+(?:,\d{3})*(?:\.\d+)?)"),
        "currentGPM": extract_percentage(full_text, r"(?:Current|Actual).*?GPM[\s\S]*?(\d+(?:\.\d+)?)\s*%"),
        "actualCosts": extract_number(full_text, r"Actual Costs[\s\S]*?(\d+(?:,\d{3})*(?:\.\d+)?)"),
        "projectProgress": extract_percentage(full_text, r"(?:Estimated Completion|Project Progress)[\s\S]*?(\d+(?:\.\d+)?)\s*%"),
    }
    
    return data

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: parse_pdf.py <pdf_path>"}))
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    try:
        result = parse_dashboard_pdf(pdf_path)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
