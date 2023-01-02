import React from "react";
import { Table } from "react-bootstrap";
export default function ALUStationsTable({ stations }) {
	return (
		<Table bordered hover>
			<thead>
				<tr>
					<th>Key</th>
					<th>Busy</th>
					<th>Op</th>
					<th>Vi</th>
					<th>Vk</th>
					<th>Qi</th>
					<th>Qk</th>
					<th>T</th>
				</tr>
			</thead>
			<tbody>
				{stations.map((station, i) => (
					<tr>
						<th>{station.key}</th>
						<th>{station.busy}</th>
						<th>{station.op}</th>
						<th>{station.Vi}</th>
						<th>{station.Vk}</th>
						<th>{station.Qi}</th>
						<th>{station.Qk}</th>
						<th>{station.T}</th>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
