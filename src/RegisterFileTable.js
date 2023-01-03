import React from "react";
import { Table } from "react-bootstrap";
export default function RegisterFileTable({ registers }) {
	return (
		<Table className=" table-sm" bordered hover responsive>
			<thead>
				<tr>
					<th className="fs-5">Key</th>
					{registers.map((register, i) => (
						<th className="fs-5">{register.key}</th>
					))}
				</tr>
			</thead>
			<tbody>
				<tr>
					<th className="fs-5">V</th>
					{registers.map((register, i) => (
						<th className="fs-6">{register.V}</th>
					))}
				</tr>
				<tr>
					<th className="fs-5">Q</th>
					{registers.map((register, i) => (
						<th className="fs-6">{register.Q}</th>
					))}
				</tr>
			</tbody>
		</Table>
	);
}
