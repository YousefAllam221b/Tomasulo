import React from "react";
import { Table } from "react-bootstrap";
export default function LoadStationsTable({ stations }) {
	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>Key</th>
					<th>Busy</th>
					<th>Address</th>
					<th>T</th>
				</tr>
			</thead>
			<tbody>
				{stations.map((station, i) => (
					<tr key={`Load_${station.key}_${i}`}>
						<th>{station.key}</th>
						<th>{station.busy}</th>
						<th>{station.address}</th>
						<th>{station.T}</th>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
