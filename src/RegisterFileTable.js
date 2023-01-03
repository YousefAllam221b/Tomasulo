import React from "react";
import { Table } from "react-bootstrap";
export default function RegisterFileTable({ registers }) {
	return (
		<Table className=" table-sm" striped bordered hover style={{ fontSize: "10px" }}>
			<thead>
				<tr>
					<th>Key</th>
					<th>V</th>
					<th>Q</th>
				</tr>
			</thead>
			<tbody>
				{registers.map((register, i) => (
					<tr key={`RegisterFile_${register.key}_${i}`}>
						<th className="fs-6">{register.key}</th>
						<th>{register.V}</th>
						<th>{register.Q}</th>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
