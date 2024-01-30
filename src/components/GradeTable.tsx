import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { IGrade } from '../types/api_types';

interface GradeTableProps {
  grades: IGrade[];
}

export const GradeTable: React.FC<GradeTableProps> = ({ grades }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="grades table">
        <TableHead>
          <TableRow>
            <TableCell>Student ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Grade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grades.map((grade) => (
            <TableRow key={grade.studentId}>
              <TableCell>{grade.studentId}</TableCell>
              <TableCell>{grade.name}</TableCell>
              <TableCell>
                {Object.entries(grade.grades).map(([assignment, gradeValue]) => (
                  <div key={assignment}>{`${assignment}: ${gradeValue}`}</div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
