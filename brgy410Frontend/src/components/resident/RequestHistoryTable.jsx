import Table from '../common/tables/Table';
import { format } from 'date-fns';

export default function RequestHistoryTable({ requests, onRequestClick }) {
  const columns = [
    {
      header: 'Document Type',
      accessor: 'document_type',
      render: (row) => (
        <span className="font-medium">{row.document_type}</span>
      )
    },
    {
      header: 'Purpose',
      accessor: 'purpose'
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => format(new Date(row.date), 'MMM. dd, yyyy')
    }
  ];

  return (
    <Table
      columns={columns}
      data={requests}
      onRowClick={onRequestClick}
    />
  );
}