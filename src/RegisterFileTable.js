import React from "react";
import { Table } from "react-bootstrap";
export default function RegisterFileTable({ registers, memory }) {
	return (
		<Table className=" table-sm" bordered hover responsive>
			<thead>
				<tr>
					{!memory && (
						<>
							<th className="fs-5">Key</th>
							{registers.map((register, i) => (
								<th className="fs-5">{register.key}</th>
							))}
						</>
					)}
					{memory && (
						<>
							<th className="fs-5">Index</th>
							{registers.map((memory, i) => (
								<th className="fs-5">{i}</th>
							))}
						</>
					)}
				</tr>
			</thead>
			<tbody>
				{!memory && (
					<>
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
					</>
				)}
				{memory && (
					<tr>
						<th className="fs-5">V</th>
						{registers.map((memory, i) => (
							<th className="fs-6">{memory}</th>
						))}
					</tr>
				)}
			</tbody>
		</Table>
	);
}
