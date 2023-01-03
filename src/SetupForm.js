import { Button, Col, Form, Row } from "react-bootstrap";
import { Multiselect } from "multiselect-react-dropdown";
import { useRef, useState } from "react";

export default function SetupForm({ instructions, setInstructions }) {
	const [InstructionType, setInstructionType] = useState("ADD.D");
	const Destination = useRef();
	const Src1 = useRef();
	const Src2 = useRef();

	const LoadDestination = useRef();
	const LoadSrc = useRef();

	const StoreSrc = useRef();
	const StoreDestination = useRef();

	const handleAddInstruction = () => {
		let instruction = InstructionType + " F";
		if (!(InstructionType === "L.D" || InstructionType === "S.D")) {
			instruction +=
				Destination.current.value + " F" + Src1.current.value + " F" + Src2.current.value;
		} else if (InstructionType === "L.D") {
			instruction += LoadDestination.current.value + " " + LoadSrc.current.value;
		} else if (InstructionType === "S.D") {
			instruction += StoreSrc.current.value + " " + StoreDestination.current.value;
		}
		setInstructions([...instructions, instruction]);
	};

	return (
		<>
			<Row className="d-flex">
				<Col sm={2}>
					<Multiselect
						id="singleSelectSubjects"
						options={["ADD.D", "SUB.D", "MULT.D", "DIV.D", "L.D", "S.D"]}
						selectedValues={[InstructionType]}
						onSelect={(_, selectedItem) => {
							setInstructionType(selectedItem);
						}}
						singleSelect={true}
						isObject={false}
						placeholder="Select Instruction OpCode"
						closeOnSelect={true}
						showArrow={true}
						avoidHighlightFirstOption={true}
						hidePlaceholder={true}
					/>
				</Col>
				{!(InstructionType === "L.D" || InstructionType === "S.D") && (
					<>
						<Form.Control
							className="fitWidth"
							ref={Destination}
							type="number"
							placeholder="Destination Register"
						/>
						<Form.Control
							className="fitWidth"
							ref={Src1}
							type="number"
							placeholder="Src 1 Register"
						/>
						<Form.Control
							className="fitWidth"
							ref={Src2}
							type="number"
							placeholder="Src 2 Register"
						/>
					</>
				)}
				{InstructionType === "L.D" && (
					<>
						<Form.Control
							className="fitWidth"
							ref={LoadDestination}
							type="number"
							placeholder="Destination Register"
						/>
						<Form.Control
							className="fitWidth"
							ref={LoadSrc}
							type="number"
							placeholder="Memory Address"
						/>
					</>
				)}
				{InstructionType === "S.D" && (
					<>
						<Form.Control
							className="fitWidth"
							ref={StoreSrc}
							type="number"
							placeholder="Src Register"
						/>
						<Form.Control
							className="fitWidth"
							ref={StoreDestination}
							type="number"
							placeholder="Memory Address"
						/>
					</>
				)}
				<Button className="fitWidth" onClick={handleAddInstruction}>
					Add Instruction
				</Button>
			</Row>
		</>
	);
}
