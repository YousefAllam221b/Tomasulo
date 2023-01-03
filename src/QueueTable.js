import { Table } from "react-bootstrap";

export default function QueueTable({ instructions }) {
	return (
		<Table bordered hover className="mt-2">
			<thead>
				<tr>
					<th>OpCode</th>
					<th>Destination</th>
					<th>J</th>
					<th>K</th>
					<th>Issue</th>
					<th>Execution Start</th>
					<th>Execution End</th>
					<th>Write Result</th>
				</tr>
			</thead>
			<tbody>
				{instructions.map((instruction, i) => (
					<tr key={`Queue_${instruction.key}_${i}`}>
						<th>{instruction.op}</th>
						<th>{instruction.destination}</th>
						<th>{instruction.src1}</th>
						<th>{instruction.src2}</th>
						<th>{instruction.issue}</th>
						<th>{instruction.execStart}</th>
						<th>{instruction.execEnd}</th>
						<th>{instruction.writeBack}</th>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
