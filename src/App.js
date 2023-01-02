import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import ALUStationsTable from "./ALUStationsTable";
import LoadStationsTable from "./LoadStationsTable";
import StoreStationsTable from "./StoreStationsTable";
import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

function App() {
	let instructions = [
		"L.D F1 1",
		"L.D F2 2",
		"ADD.D F3 F1 F2",
		"MUL.D F4 F2 F3",
		"SUB.D F5 F3 F4",
		"DIV.D F10 F6 F7",
		"S.D F10 44",
	];

	// Add, Sub, Div and Mul.
	class ALUStation {
		constructor(key, busy, op, Vi, Vk, Qi, Qk, T, instructionIndex) {
			this.key = key;
			this.busy = busy;
			this.op = op;
			this.Vi = Vi;
			this.Vk = Vk;
			this.Qi = Qi;
			this.Qk = Qk;
			this.T = T;
			this.instructionIndex = instructionIndex;
		}
	}

	class LoadStation {
		constructor(key, busy, address, T, instructionIndex) {
			this.key = key;
			this.busy = busy;
			this.address = address;
			this.T = T;
			this.instructionIndex = instructionIndex;
		}
	}

	class StoreStation {
		constructor(key, busy, address, V, Q, T, instructionIndex) {
			this.key = key;
			this.busy = busy;
			this.address = address;
			this.V = V;
			this.Q = Q;
			this.T = T;
			this.instructionIndex = instructionIndex;
		}
	}

	class Register {
		constructor(key, Q, V) {
			this.key = key;
			this.Q = Q;
			this.V = V;
		}
	}

	class Queue {
		constructor(op, destination, src1, src2, issue, execStart, execEnd, writeBack) {
			this.op = op;
			this.destination = destination;
			this.src1 = src1;
			this.src2 = src2;
			this.issue = issue;
			this.execStart = execStart;
			this.execEnd = execEnd;
			this.writeBack = writeBack;
		}
	}

	// Number of Stations, Size of Memory and Size of Register File.
	const AddAndSubNumber = 3;
	const MulAndDivNumber = 2;
	const RegisterFileNumber = 64;
	const LoadNumber = 3;
	const StoreNumber = 3;
	const MemoryNumber = 100;

	const [AddAndSubStations, setAddAndSubStations] = useState([]);
	const [MulAndDivStations, setMulAndDivStations] = useState([]);
	const [StoreStations, setStoreStations] = useState([]);
	const [LoadStations, setLoadStations] = useState([]);
	const [RegisterFile, setRegisterFile] = useState([]);
	const [Memory, setMemory] = useState([]);

	// Data Structures
	const [QueueArray, setQueueArray] = useState([]);
	const [ReadyRegisters, setReadyRegisters] = useState([]);
	const [WriteMemory, setWriteMemory] = useState([]);

	const handleSetup = () => {
		fetchInstructions();
		let AddAndSubStationsInitial = [];
		let MulAndDivStationsInitial = [];
		let LoadStationsInitial = [];
		let StoreStationsInitial = [];
		let RegisterFileInitial = [];
		let MemoryInitial = [];
		for (let index = 1; index <= AddAndSubNumber; index++) {
			let station = new ALUStation("A" + index, 0, 0, 0, 0, 0, 0, 0, 0);
			AddAndSubStationsInitial.push(station);
		}
		setAddAndSubStations(AddAndSubStationsInitial);
		for (let index = 1; index <= MulAndDivNumber; index++) {
			let station = new ALUStation("M" + index, 0, 0, 0, 0, 0, 0, 0, 0);
			MulAndDivStationsInitial.push(station);
		}
		setMulAndDivStations(MulAndDivStationsInitial);
		for (let index = 1; index <= LoadNumber; index++) {
			let station = new LoadStation("L" + index, 0, 0, 0, 0);
			LoadStationsInitial.push(station);
		}
		setLoadStations(LoadStationsInitial);
		for (let index = 1; index <= StoreNumber; index++) {
			let station = new StoreStation("L" + index, 0, 0, 0, 0, 0, 0);
			StoreStationsInitial.push(station);
		}
		setStoreStations(StoreStationsInitial);
		for (let index = 1; index <= RegisterFileNumber; index++) {
			let register = new Register("F" + index, 0, 0, 0, 0, 0, 0);
			RegisterFileInitial.push(register);
		}
		setRegisterFile(RegisterFileInitial);
		MemoryInitial = Array(MemoryNumber).fill(0);
		setMemory(MemoryInitial);
	};
	// Initializing Stations, Memory and RegisterFile Data Structures

	Memory[1] = 5;
	Memory[2] = 3;

	// Stations Latency
	const LoadAndStoreLatency = 1;
	const AddAndSubLatency = 2;
	const MulAndDivLatency = 3;

	let [Clock, setClock] = useState(0);
	let [QueueIndex, setQueueIndex] = useState(0);

	// Parses all Instructions from instructions
	const fetchInstructions = async () => {
		try {
			let newInstructions = [];
			instructions.forEach((instruction) => {
				let instructionSplitted = instruction.split(" ");
				newInstructions.push(
					new Queue(
						instructionSplitted[0],
						instructionSplitted[1],
						instructionSplitted[2],
						instructionSplitted[3],
						-1,
						-1,
						-1,
						-1
					)
				);
			});
			setQueueArray([...QueueArray, ...newInstructions]);
		} catch (err) {
			console.log(err);
		}
	};

	// Decrements Time by 1 for any Station that is busy and has it's operands ready for executing.
	const decrementTime = () => {
		for (let index = 0; index < AddAndSubNumber; index++) {
			if (AddAndSubStations[index].busy === 1) {
				if (AddAndSubStations[index].Qi === 0 && AddAndSubStations[index].Qk === 0) {
					let newAddAndSubStations = [...AddAndSubStations];
					newAddAndSubStations[index].T -= 1;
					setAddAndSubStations(newAddAndSubStations);
				}
			}
		}
		for (let index = 0; index < MulAndDivNumber; index++) {
			if (MulAndDivStations[index].busy === 1) {
				if (MulAndDivStations[index].Qi === 0 && MulAndDivStations[index].Qk === 0) {
					let newMulAndDivStations = [...MulAndDivStations];
					newMulAndDivStations[index].T -= 1;
					setMulAndDivStations(newMulAndDivStations);
				}
			}
		}
		for (let index = 0; index < LoadNumber; index++) {
			if (LoadStations[index].busy === 1) {
				let newLoadStations = [...LoadStations];
				newLoadStations[index].T -= 1;
				setLoadStations(newLoadStations);
			}
		}
		for (let index = 0; index < StoreNumber; index++) {
			if (StoreStations[index].busy === 1) {
				if (StoreStations[index].Q == 0) {
					StoreStations[index].T -= 1;
					let newStoreStations = [...StoreStations];
					newStoreStations[index].T -= 1;
					setStoreStations(newStoreStations);
				}
			}
		}
	};

	// Gets the Value or Q (the Key) of the station that the Register is waiting for.
	const getRegisterValue = (key) => {
		for (let index = 0; index < RegisterFileNumber; index++) {
			if (RegisterFile[index].key === key) {
				if (RegisterFile[index].Q == 0) {
					return RegisterFile[index].V;
				} else {
					return RegisterFile[index].Q;
				}
			}
		}
	};

	//
	const setRegisterKey = (key, stationKey) => {
		for (let index = 0; index < RegisterFileNumber; index++) {
			if (RegisterFile[index].key === key) {
				let newRegisterFile = [...RegisterFile];
				newRegisterFile[index].Q = stationKey;
				setRegisterFile(newRegisterFile);
				break;
			}
		}
	};

	// Gets the first free station in AddAndSubStations.
	const AddAndSubStationsChecker = () => {
		let freeStationKey = "";
		for (let index = 0; index < AddAndSubNumber; index++) {
			if (AddAndSubStations[index].busy === 0) {
				freeStationKey = AddAndSubStations[index].key;
				break;
			}
		}
		return freeStationKey;
	};

	// Gets the first free station in MulAndDivStations.
	const MulAndDivStationsChecker = () => {
		let freeStationKey = "";
		for (let index = 0; index < MulAndDivNumber; index++) {
			if (MulAndDivStations[index].busy === 0) {
				freeStationKey = MulAndDivStations[index].key;
				break;
			}
		}
		return freeStationKey;
	};

	// Gets the first free station in LoadStations.
	const LoadStationsChecker = () => {
		let freeStationKey = "";
		for (let index = 0; index < LoadNumber; index++) {
			if (LoadStations[index].busy === 0) {
				freeStationKey = LoadStations[index].key;
				break;
			}
		}
		return freeStationKey;
	};

	// Gets the first free station in StoreStations.
	const StoreStationsChecker = () => {
		let freeStationKey = "";
		for (let index = 0; index < StoreNumber; index++) {
			if (StoreStations[index].busy === 0) {
				freeStationKey = StoreStations[index].key;
				break;
			}
		}
		return freeStationKey;
	};

	const checkFinished = () => {
		let newReadyResults = [];
		let newWriteMemory = [];
		for (let index = 0; index < AddAndSubNumber; index++) {
			if (AddAndSubStations[index].busy === 1 && AddAndSubStations[index].T === -1) {
				switch (AddAndSubStations[index].op) {
					case "ADD.D": {
						let result = AddAndSubStations[index].Vi + AddAndSubStations[index].Vk;
						newReadyResults.push({
							key: AddAndSubStations[index].key,
							value: result,
							instructionIndex: AddAndSubStations[index].instructionIndex,
						});
					}
					case "SUB.D": {
						let result = AddAndSubStations[index].Vi - AddAndSubStations[index].Vk;
						newReadyResults.push({
							key: AddAndSubStations[index].key,
							value: result,
							instructionIndex: AddAndSubStations[index].instructionIndex,
						});
					}
				}
				let newAddAndSubStations = [...AddAndSubStations];
				newAddAndSubStations[index].busy = 0;
				newAddAndSubStations[index].Qi = 0;
				newAddAndSubStations[index].Qk = 0;
				newAddAndSubStations[index].Vi = 0;
				newAddAndSubStations[index].Vk = 0;
				newAddAndSubStations[index].T = 0;
				newAddAndSubStations[index].instructionIndex = 0;
				setAddAndSubStations(newAddAndSubStations);
			}
		}
		for (let index = 0; index < MulAndDivNumber; index++) {
			if (MulAndDivStations[index].busy === 1 && MulAndDivStations[index].T === -1) {
				switch (MulAndDivStations[index].op) {
					case "MUL.D": {
						let result = MulAndDivStations[index].Vi * MulAndDivStations[index].Vk;
						newReadyResults.push({
							key: MulAndDivStations[index].key,
							value: result,
							instructionIndex: MulAndDivStations[index].instructionIndex,
						});
					}
					case "DIV.D": {
						let result = MulAndDivStations[index].Vi / MulAndDivStations[index].Vk;
						newReadyResults.push({
							key: MulAndDivStations[index].key,
							value: result,
							instructionIndex: MulAndDivStations[index].instructionIndex,
						});
					}
				}
				let newMulAndDivStations = [...MulAndDivStations];
				newMulAndDivStations[index].busy = 0;
				newMulAndDivStations[index].Qi = 0;
				newMulAndDivStations[index].Qk = 0;
				newMulAndDivStations[index].Vi = 0;
				newMulAndDivStations[index].Vk = 0;
				newMulAndDivStations[index].T = 0;
				newMulAndDivStations[index].instructionIndex = 0;

				setMulAndDivStations(newMulAndDivStations);
			}
		}
		for (let index = 0; index < LoadNumber; index++) {
			if (LoadStations[index].busy === 1 && LoadStations[index].T === -1) {
				let result = Memory[LoadStations[index].address];
				newReadyResults.push({
					key: LoadStations[index].key,
					value: result,
					instructionIndex: MulAndDivStations[index].instructionIndex,
				});
				let newLoadStations = [...LoadStations];
				newLoadStations[index].busy = 0;
				newLoadStations[index].address = 0;
				newLoadStations[index].instructionIndex = 0;

				setLoadStations(newLoadStations);
			}
		}
		for (let index = 0; index < StoreNumber; index++) {
			if (StoreStations[index].busy === 1 && StoreStations[index].T === -1) {
				let result = StoreStations[index].V;
				newWriteMemory.push({
					key: StoreStations[index].address,
					value: result,
					instructionIndex: StoreStations[index].instructionIndex,
				});
				let newStoreStations = [...StoreStations];
				newStoreStations[index].busy = 0;
				newStoreStations[index].address = 0;
				newStoreStations[index].V = 0;
				newStoreStations[index].Q = 0;
				newStoreStations[index].instructionIndex = 0;

				setStoreStations(newStoreStations);
			}
		}
		setReadyRegisters([...ReadyRegisters, ...newReadyResults]);
		setWriteMemory([...WriteMemory, ...newWriteMemory]);
	};

	useEffect(() => {
		if (ReadyRegisters.length !== 0) {
			let oneReady = ReadyRegisters.sort((a, b) => a.instructionIndex - b.instructionIndex)[0];
			for (let index = 0; index < AddAndSubNumber; index++) {
				if (oneReady.key === AddAndSubStations[index].Qi) {
					let newAddAndSubStations = [...AddAndSubStations];
					newAddAndSubStations[index].Qi = 0;
					newAddAndSubStations[index].Vi = oneReady.value;
					setAddAndSubStations(newAddAndSubStations);
				} else if (oneReady.key === AddAndSubStations[index].Qk) {
					let newAddAndSubStations = [...AddAndSubStations];
					newAddAndSubStations[index].Qk = 0;
					newAddAndSubStations[index].Vk = oneReady.value;
					setAddAndSubStations(newAddAndSubStations);
				}
			}
			for (let index = 0; index < MulAndDivNumber; index++) {
				if (oneReady.key === MulAndDivStations[index].Qi) {
					let newMulAndDivStations = [...MulAndDivStations];
					newMulAndDivStations[index].Qi = 0;
					newMulAndDivStations[index].Vi = oneReady.value;
					setMulAndDivStations(newMulAndDivStations);
				} else if (key === MulAndDivStations[index].Qk) {
					let newMulAndDivStations = [...MulAndDivStations];
					newMulAndDivStations[index].Qk = 0;
					newMulAndDivStations[index].Vk = oneReady.value;
					setMulAndDivStations(newMulAndDivStations);
				}
			}
			for (let index = 0; index < StoreNumber; index++) {
				if (key === StoreStations[index].Q) {
					StoreStations[index].Q = 0;
					StoreStations[index].V = value;
				}
			}
		}
	}, [ReadyRegisters]);

	const runCycle = () => {
		decrementTime();
		checkFinished();
		if (QueueIndex !== QueueArray.length) {
			console.log(QueueIndex);
			let currentInstruction = QueueArray[QueueIndex];
			console.log(currentInstruction);
			let opCode = currentInstruction.op;
			let destination = currentInstruction.destination;
			let src1 = currentInstruction.src1;
			let src2 = currentInstruction.src2;

			switch (opCode) {
				case "ADD.D":
				case "SUB.D":
					{
						let stationKey = AddAndSubStationsChecker();
						if (stationKey) {
							for (let index = 0; index < AddAndSubNumber; index++) {
								if (AddAndSubStations[index].key === stationKey) {
									let newAddAndSubStations = [...AddAndSubStations];
									newAddAndSubStations[index].busy = 1;
									newAddAndSubStations[index].op = opCode;
									newAddAndSubStations[index].T = AddAndSubLatency;
									newAddAndSubStations[index].instructionIndex = QueueIndex;
									let src1Value = getRegisterValue(src1);
									let src2Value = getRegisterValue(src2);
									if (typeof src1Value === "string") {
										newAddAndSubStations[index].Qi = src1Value;
									} else {
										newAddAndSubStations[index].Vi = src1Value;
									}

									if (typeof src2Value === "string") {
										newAddAndSubStations[index].Qk = src2Value;
									} else {
										newAddAndSubStations[index].Vk = src2Value;
									}
									setAddAndSubStations(newAddAndSubStations);
									setRegisterKey(destination, stationKey);
									break;
								}
							}

							setQueueIndex(QueueIndex + 1);
						}
					}

					break;
				case "MUL.D":
				case "DIV.D":
					{
						let stationKey = MulAndDivStationsChecker();
						if (stationKey) {
							for (let index = 0; index < MulAndDivNumber; index++) {
								if (MulAndDivStations[index].key === stationKey) {
									let newMulAndDivStations = [...MulAndDivStations];
									newMulAndDivStations[index].busy = 1;
									newMulAndDivStations[index].op = opCode;
									newMulAndDivStations[index].T = MulAndDivLatency;
									newMulAndDivStations[index].instructionIndex = QueueIndex;

									let src1Value = getRegisterValue(src1);
									let src2Value = getRegisterValue(src2);
									if (typeof src1Value === "string") {
										newMulAndDivStations[index].Qi = src1Value;
									} else {
										newMulAndDivStations[index].Vi = src1Value;
									}

									if (typeof src2Value === "string") {
										newMulAndDivStations[index].Qk = src2Value;
									} else {
										newMulAndDivStations[index].Vk = src2Value;
									}
									setMulAndDivStations(newMulAndDivStations);
									setRegisterKey(destination, stationKey);
									break;
								}
							}

							setQueueIndex(QueueIndex + 1);
						}
					}
					break;
				case "L.D":
					{
						let stationKey = LoadStationsChecker();
						if (stationKey) {
							for (let index = 0; index < MulAndDivNumber; index++) {
								if (LoadStations[index].key === stationKey) {
									let newLoadStations = [...LoadStations];
									newLoadStations[index].busy = 1;
									newLoadStations[index].address = parseInt(src1);
									newLoadStations[index].T = LoadAndStoreLatency;
									newLoadStations[index].instructionIndex = QueueIndex;

									setLoadStations(newLoadStations);
									setRegisterKey(destination, stationKey);
									break;
								}
							}
							setQueueIndex(QueueIndex + 1);
						}
					}
					break;
				case "S.D":
					{
						let stationKey = StoreStationsChecker();
						if (stationKey) {
							for (let index = 0; index < MulAndDivNumber; index++) {
								if (StoreStations[index].key === stationKey) {
									let newStoreStations = [...StoreStations];
									newStoreStations[index].busy = 1;
									newStoreStations[index].address = src1;
									newStoreStations[index].T = LoadAndStoreLatency;
									newStoreStations[index].instructionIndex = QueueIndex;

									let value = getRegisterValue(destination);
									if (typeof value === "string") newStoreStations[index].Q = value;
									if (typeof value === "number") newStoreStations[index].V = value;
									setStoreStations(newStoreStations);
									break;
								}
							}

							setQueueIndex(QueueIndex + 1);
						}
					}
					break;
			}
		}
		// console.log("AddAndSubStations: ");
		// console.log(AddAndSubStations);
		// console.log("MulAndDivStations: ");
		// console.log(MulAndDivStations);
		// console.log("LoadStations: ");
		// console.log(LoadStations);
		// console.log("StoreStations: ");
		// console.log(StoreStations);
		// console.log("RegisterFile: ");
		// console.log(RegisterFile);
		// console.log("Queue: ");
		// console.log(QueueArray);
		// console.log(Memory);
		// console.log("/////////////////////////");
		setClock(Clock + 1);
	};

	return (
		<Container className="App">
			<h1>{Clock}</h1>
			<Button onClick={handleSetup}>Start</Button>
			<Button onClick={runCycle}>Next Cycle</Button>
			<Row>
				<Col sm={6}>
					<h3 className="fitWidth">AddAndSubStations</h3>
					<ALUStationsTable stations={AddAndSubStations} key="AddAndSubStations" />
				</Col>
				<Col sm={6}>
					<h3 className="fitWidth">MulAndDivStations</h3>
					<ALUStationsTable stations={MulAndDivStations} key="MulAndDivStations" />
				</Col>
			</Row>
			<Row>
				<Col sm={4}>
					<h3 className="fitWidth">LoadStations</h3>
					<LoadStationsTable stations={LoadStations} key="LoadStations" />
				</Col>
				<Col sm={4}>
					<h3 className="fitWidth">StoreStations</h3>
					<StoreStationsTable stations={StoreStations} key="StoreStations" />
				</Col>
			</Row>
		</Container>
	);
}

export default App;
