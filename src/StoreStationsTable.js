import React from "react";
import { Table } from "react-bootstrap";
export default function StoreStationsTable({ stations }) {
	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>Key</th>
					<th>Busy</th>
					<th>Address</th>
					<th>V</th>
					<th>Q</th>
					<th>T</th>
				</tr>
			</thead>
			<tbody>
				{stations.map((station, i) => (
					<tr key={`Store_${station.key}_${i}`}>
						<th>{station.key}</th>
						<th>{station.busy}</th>
						<th>{station.address}</th>
						<th>{station.V}</th>
						<th>{station.Q}</th>
						<th>{station.T}</th>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
