import { Button, Col, Form, Row } from "react-bootstrap";
import { Multiselect } from "multiselect-react-dropdown";
import { useRef, useState } from "react";

export default function SetupForm({
	instructions,
	setInstructions,
	AddLatencyRef,
	SubLatencyRef,
	MulLatencyRef,
	DivLatencyRef,
	LoadLatencyRef,
	StoreLatencyRef,
}) {
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
			<div className="mb-5">
				<h2>ALU Latencies</h2>
				<div className="d-flex justify-content-between">
					<div className="d-flex fitWidth">
						<h3 className="fitWidth my-auto me-2">ADD.D</h3>
						<Form.Control
							className="fitWidth"
							ref={AddLatencyRef}
							type="text"
							placeholder="ADD.D"
						/>
					</div>
					<div className="d-flex fitWidth">
						<h3 className="fitWidth my-auto me-2">SUB.D</h3>
						<Form.Control
							className="fitWidth"
							ref={SubLatencyRef}
							type="text"
							placeholder="SUB.D"
						/>
					</div>
					<div className="d-flex fitWidth">
						<h3 className="fitWidth my-auto me-2">MULT.D</h3>
						<Form.Control
							className="fitWidth"
							ref={MulLatencyRef}
							type="text"
							placeholder="MULT.D"
						/>
					</div>
					<div className="d-flex fitWidth">
						<h3 className="fitWidth my-auto me-2">DIV.D</h3>
						<Form.Control
							className="fitWidth"
							ref={DivLatencyRef}
							type="text"
							placeholder="DIV.D"
						/>
					</div>
				</div>
			</div>
			<div className="mb-5">
				<h2>Load and Store Latencies</h2>

				<Row>
					<h3 className="fitWidth my-auto">L.D</h3>
					<Form.Control
						className="fitWidth"
						ref={LoadLatencyRef}
						type="text"
						placeholder="L.D"
					/>{" "}
					<h3 className="fitWidth my-auto">S.D</h3>
					<Form.Control className="fitWidth" ref={StoreLatencyRef} type="text" placeholder="S.D" />
				</Row>
			</div>
			<div className="mb-5">
				<h2>Add Instruction</h2>
				<Row className="d-flex justify-content-between">
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
							<div className="d-flex fitWidth">
								<h3 className="fitWidth my-auto me-2">F</h3>
								<Form.Control
									className="fitWidth"
									ref={Destination}
									type="number"
									placeholder="Destination Register"
								/>
							</div>
							<div className="d-flex fitWidth">
								<h3 className="fitWidth my-auto me-2">F</h3>
								<Form.Control
									className="fitWidth"
									ref={Src1}
									type="number"
									placeholder="Src 1 Register"
								/>
							</div>
							<div className="d-flex fitWidth">
								<h3 className="fitWidth my-auto me-2">F</h3>
								<Form.Control
									className="fitWidth"
									ref={Src2}
									type="number"
									placeholder="Src 2 Register"
								/>
							</div>
						</>
					)}
					{InstructionType === "L.D" && (
						<>
							<h3 className="fitWidth my-auto me-2">F</h3>
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
							<h3 className="fitWidth my-auto me-2">F</h3>
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
			</div>
		</>
	);
}
