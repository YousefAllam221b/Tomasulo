import React from "react";
import { Table } from "react-bootstrap";
export default function ALUStationsTable({ isAdd, stations }) {
	return (
		<Table bordered hover>
			<thead>
				<tr>
					<th>Key</th>
					<th>Busy</th>
					<th>Op</th>
					<th>Vj</th>
					<th>Vk</th>
					<th>Qj</th>
					<th>Qk</th>
					<th>T</th>
				</tr>
			</thead>
			<tbody>
				{stations.map((station, i) => (
					<tr key={`ALU_${isAdd}_${station.key}_${i}`}>
						<th>{station.key}</th>
						<th>{station.busy}</th>
						<th>{station.op}</th>
						<th>{station.Vj}</th>
						<th>{station.Vk}</th>
						<th>{station.Qj}</th>
						<th>{station.Qk}</th>
						<th>{station.T}</th>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
