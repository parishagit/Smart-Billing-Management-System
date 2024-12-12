import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import './Invoice.css'; // Import custom CSS for styling

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      setError('Error fetching invoices. Please try again later.');
      console.error('Error fetching invoices:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invoiceData = { name, amount, date, description };
    console.log('Submitting invoice data:', invoiceData); // Debugging line
    try {
      if (editing) {
        await fetch(`/api/invoices/${currentInvoice.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData),
        });
      } else {
        const response = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData),
        });
        if (!response.ok) {
          throw new Error('Failed to create invoice');
        }
      }
      resetForm();
      fetchInvoices();
    } catch (error) {
      setError('Error saving invoice. Please try again.');
      console.error('Error saving invoice:', error);
    }
  };

  const handleEdit = (invoice) => {
    setEditing(true);
    setCurrentInvoice(invoice);
    setName(invoice.name);
    setAmount(invoice.amount);
    setDate(invoice.date);
    setDescription(invoice.description);
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
        fetchInvoices();
      } catch (error) {
        setError('Error deleting invoice. Please try again.');
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setDate('');
    setDescription('');
    setEditing(false);
    setCurrentInvoice(null);
    setError('');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(invoices);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    XLSX.writeFile(wb, "Invoices.xlsx");
  };

  return (
    <Container className="mt- 4">
      <h2 className="text-center mb-4">Invoice Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </Form.Group>
              <Button type="submit" variant="primary" className="mt-3 ">
                {editing ? 'Update Invoice' : 'Add Invoice'}
              </Button>
            </Form>
          </Card>
        </Col>
        <Col md={6}>
          <Button onClick={exportToExcel} className="mb-3">
            <FontAwesomeIcon icon={faFileInvoice} /> Export to Excel
          </Button>
          <Card className="p-3 shadow-sm">
            <ListGroup>
              {invoices.map((invoice) => (
                <ListGroup.Item key={invoice.id}>
                  <Row>
                    <Col>{invoice.name}</Col>
                    <Col>{invoice.amount}</Col>
                    <Col>{invoice.date}</Col>
                    <Col>{invoice.description}</Col>
                    <Col>
                      <Button onClick={() => handleEdit(invoice)} variant="warning" className="me-2">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                      <Button onClick={() => handleRemove(invoice.id)} variant="danger">
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        
      </Row>
    </Container>
  );
};

export default Invoice;