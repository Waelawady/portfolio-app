import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Invoice {
  invoiceNumber: string;
  amount: number;
  submissionDate: string;
  status: 'paid' | 'unpaid' | 'submitted' | 'to_submit';
  notes: string;
}

interface Expense {
  expenseType: string;
  amount: number;
  paymentDate: string;
  description: string;
}

export default function ForecastData() {
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const [, setLocation] = useLocation();

  const [invoices, setInvoices] = useState<Invoice[]>([{
    invoiceNumber: '',
    amount: 0,
    submissionDate: '',
    status: 'to_submit',
    notes: '',
  }]);

  const [expenses, setExpenses] = useState<Expense[]>([{
    expenseType: 'subconsultant',
    amount: 0,
    paymentDate: '',
    description: '',
  }]);

  const addForecastMutation = trpc.project.addForecast.useMutation({
    onSuccess: () => {
      toast.success('Forecast data saved successfully!');
      setLocation(`/project/${projectId}/generate`);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  if (!isAuthenticated) {
    setLocation('/');
    return null;
  }

  const addInvoice = () => {
    setInvoices([...invoices, {
      invoiceNumber: '',
      amount: 0,
      submissionDate: '',
      status: 'to_submit',
      notes: '',
    }]);
  };

  const removeInvoice = (index: number) => {
    setInvoices(invoices.filter((_, i) => i !== index));
  };

  const updateInvoice = (index: number, field: keyof Invoice, value: any) => {
    const updated = [...invoices];
    updated[index] = { ...updated[index], [field]: value };
    setInvoices(updated);
  };

  const addExpense = () => {
    setExpenses([...expenses, {
      expenseType: 'subconsultant',
      amount: 0,
      paymentDate: '',
      description: '',
    }]);
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const updateExpense = (index: number, field: keyof Expense, value: any) => {
    const updated = [...expenses];
    updated[index] = { ...updated[index], [field]: value };
    setExpenses(updated);
  };

  const handleSubmit = () => {
    // Filter out empty entries
    const validInvoices = invoices.filter(inv => inv.invoiceNumber && inv.amount > 0);
    const validExpenses = expenses.filter(exp => exp.amount > 0);

    addForecastMutation.mutate({
      projectId,
      invoices: validInvoices,
      expenses: validExpenses,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Add Forecast Data
            </h1>
            <p className="text-gray-600">
              Enter future invoices and expenses to complete your portfolio projections
            </p>
          </div>

          {/* Future Invoices */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Future Client Invoices</CardTitle>
              <CardDescription>
                Add invoices you plan to submit or have submitted but not yet paid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {invoices.map((invoice, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Invoice #{index + 1}</h4>
                    {invoices.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInvoice(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label>Invoice Number</Label>
                      <Input
                        value={invoice.invoiceNumber}
                        onChange={(e) => updateInvoice(index, 'invoiceNumber', e.target.value)}
                        placeholder="INV-001"
                      />
                    </div>
                    <div>
                      <Label>Amount (QAR)</Label>
                      <Input
                        type="number"
                        value={invoice.amount || ''}
                        onChange={(e) => updateInvoice(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Submission Date</Label>
                      <Input
                        type="date"
                        value={invoice.submissionDate}
                        onChange={(e) => updateInvoice(index, 'submissionDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={invoice.status}
                        onValueChange={(value) => updateInvoice(index, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="to_submit">To Submit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={invoice.notes}
                      onChange={(e) => updateInvoice(index, 'notes', e.target.value)}
                      placeholder="Additional notes..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addInvoice} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Future Expenses */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Future Expenses</CardTitle>
              <CardDescription>
                Add anticipated expenses like subconsultant payments, missions, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenses.map((expense, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Expense #{index + 1}</h4>
                    {expenses.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExpense(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label>Expense Type</Label>
                      <Select
                        value={expense.expenseType}
                        onValueChange={(value) => updateExpense(index, 'expenseType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subconsultant">Subconsultant</SelectItem>
                          <SelectItem value="mission">Mission</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount (QAR)</Label>
                      <Input
                        type="number"
                        value={expense.amount || ''}
                        onChange={(e) => updateExpense(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Payment Date</Label>
                      <Input
                        type="date"
                        value={expense.paymentDate}
                        onChange={(e) => updateExpense(index, 'paymentDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={expense.description}
                      onChange={(e) => updateExpense(index, 'description', e.target.value)}
                      placeholder="Description..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addExpense} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Expense
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setLocation(`/project/${projectId}/generate`)}>
              Skip & Generate
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={addForecastMutation.isPending}
              className="flex-1"
            >
              {addForecastMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
