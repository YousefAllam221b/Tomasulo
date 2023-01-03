import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import ALUStationsTable from "./ALUStationsTable";
import LoadStationsTable from "./LoadStationsTable";
import StoreStationsTable from "./StoreStationsTable";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import RegisterFileTable from "./RegisterFileTable";
import QueueTable from "./QueueTable";
function App() {
	let instructions = [
		"MUL.D R3 R1 R2",
		"ADD.D R5 R3 R4",
		"ADD.D R7 R2 R6",
		"ADD.D R10 R8 R9",
		"MUL.D R11 R7 R10",
		"ADD.D R5 R5 R11",
	];

	// Add, Sub, Div and Mul.
	class ALUStation {
		constructor(key, busy, op, Vj, Vk, Qj, Qk, T, instructionIndex) {
			this.key = key;
			this.busy = busy;
			this.op = op;
			this.Vj = Vj;
			this.Vk = Vk;
			this.Qj = Qj;
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
	// Initializing Stations, Memory and RegisterFile Data Structures

	// Stations Latency
	const LoadAndStoreLatency = 8;
	const AddAndSubLatency = 4;
	const MulLatency = 6;
	const DivLatency = 40;

	// Number of Stations, Size of Memory and Size of Register File.
	const AddAndSubNumber = 3;
	const MulAndDivNumber = 2;
	const RegisterFileNumber = 63;
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
	const [DetectChange, setDetectChange] = useState(false);

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
			let station = new StoreStation("S" + index, 0, 0, 0, 0, 0, 0);
			StoreStationsInitial.push(station);
		}
		setStoreStations(StoreStationsInitial);
		for (let index = 0; index <= RegisterFileNumber; index++) {
			let register = new Register("R" + index, 0, index);
			RegisterFileInitial.push(register);
		}

		setRegisterFile(RegisterFileInitial);
		MemoryInitial = Array(MemoryNumber).fill(0);
		setMemory(MemoryInitial);
	};

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
				if (AddAndSubStations[index].Qj === 0 && AddAndSubStations[index].Qk === 0) {
					if (AddAndSubStations[index].T === AddAndSubLatency) {
						let newQueueArray = [...QueueArray];
						newQueueArray[AddAndSubStations[index].instructionIndex].execStart = Clock + 1;
						setQueueArray(newQueueArray);
					}
					let newAddAndSubStations = [...AddAndSubStations];
					newAddAndSubStations[index].T -= 1;
					setAddAndSubStations(newAddAndSubStations);
				}
			}
		}
		for (let index = 0; index < MulAndDivNumber; index++) {
			if (MulAndDivStations[index].busy === 1) {
				if (MulAndDivStations[index].Qj === 0 && MulAndDivStations[index].Qk === 0) {
					switch (MulAndDivStations[index].op) {
						case "MUL.D": {
							if (MulAndDivStations[index].T === MulLatency) {
								let newQueueArray = [...QueueArray];
								newQueueArray[MulAndDivStations[index].instructionIndex].execStart = Clock + 1;
								setQueueArray(newQueueArray);
							}
						}
						case "DIV.D": {
							if (MulAndDivStations[index].T === DivLatency) {
								let newQueueArray = [...QueueArray];
								newQueueArray[MulAndDivStations[index].instructionIndex].execStart = Clock + 1;
								setQueueArray(newQueueArray);
							}
						}
					}

					let newMulAndDivStations = [...MulAndDivStations];
					newMulAndDivStations[index].T -= 1;
					setMulAndDivStations(newMulAndDivStations);
				}
			}
		}
		for (let index = 0; index < LoadNumber; index++) {
			if (LoadStations[index].busy === 1) {
				if (LoadStations[index].T === LoadAndStoreLatency) {
					let newQueueArray = [...QueueArray];
					newQueueArray[LoadStations[index].instructionIndex].execStart = Clock + 1;
					setQueueArray(newQueueArray);
				}
				let newLoadStations = [...LoadStations];
				newLoadStations[index].T -= 1;
				setLoadStations(newLoadStations);
			}
		}
		for (let index = 0; index < StoreNumber; index++) {
			if (StoreStations[index].busy === 1) {
				if (StoreStations[index].Q == 0) {
					if (StoreStations[index].T === LoadAndStoreLatency) {
						let newQueueArray = [...QueueArray];
						newQueueArray[StoreStations[index].instructionIndex].execStart = Clock + 1;
						setQueueArray(newQueueArray);
					}
					StoreStations[index].T -= 1;
					let newStoreStations = [...StoreStations];
					setStoreStations(newStoreStations);
				}
			}
		}
	};

	// Gets the Value or Q (the Key) of the station that the Register is waiting for.
	const getRegisterValue = (key) => {
		for (let index = 0; index <= RegisterFileNumber; index++) {
			if (RegisterFile[index].key === key) {
				if (RegisterFile[index].Q === 0) return RegisterFile[index].V;
				else return RegisterFile[index].Q;
			}
		}
	};

	//
	const setRegisterKey = (key, stationKey) => {
		for (let index = 0; index <= RegisterFileNumber; index++) {
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
			if (AddAndSubStations[index].busy === 1) {
				if (AddAndSubStations[index].T === -1) {
					switch (AddAndSubStations[index].op) {
						case "ADD.D": {
							let result = AddAndSubStations[index].Vj + AddAndSubStations[index].Vk;
							newReadyResults.push({
								key: AddAndSubStations[index].key,
								value: result,
								instructionIndex: AddAndSubStations[index].instructionIndex,
							});
							break;
						}
						case "SUB.D": {
							let result = AddAndSubStations[index].Vj - AddAndSubStations[index].Vk;
							newReadyResults.push({
								key: AddAndSubStations[index].key,
								value: result,
								instructionIndex: AddAndSubStations[index].instructionIndex,
							});
						}
					}
				} else if (AddAndSubStations[index].T === 0) {
					let newQueueArray = [...QueueArray];
					newQueueArray[AddAndSubStations[index].instructionIndex].execEnd = Clock + 1;
					setQueueArray(newQueueArray);
				}
			}
		}
		for (let index = 0; index < MulAndDivNumber; index++) {
			if (MulAndDivStations[index].busy === 1) {
				if (MulAndDivStations[index].T === -1) {
					switch (MulAndDivStations[index].op) {
						case "MUL.D": {
							let result = MulAndDivStations[index].Vj * MulAndDivStations[index].Vk;
							newReadyResults.push({
								key: MulAndDivStations[index].key,
								value: result,
								instructionIndex: MulAndDivStations[index].instructionIndex,
							});
							break;
						}
						case "DIV.D": {
							let result = MulAndDivStations[index].Vj / MulAndDivStations[index].Vk;
							newReadyResults.push({
								key: MulAndDivStations[index].key,
								value: result,
								instructionIndex: MulAndDivStations[index].instructionIndex,
							});
						}
					}
				} else if (MulAndDivStations[index].T === 0) {
					let newQueueArray = [...QueueArray];
					newQueueArray[MulAndDivStations[index].instructionIndex].execEnd = Clock + 1;
					setQueueArray(newQueueArray);
				}

			}
		}
		for (let index = 0; index < LoadNumber; index++) {
			if (LoadStations[index].busy === 1) {
				if (LoadStations[index].T === -1) {
					let result = Memory[LoadStations[index].address];
					newReadyResults.push({
						key: LoadStations[index].key,
						value: result,
						instructionIndex: MulAndDivStations[index].instructionIndex,
					});
				} else if (LoadStations[index].T === 0) {
					let newQueueArray = [...QueueArray];
					newQueueArray[LoadStations[index].instructionIndex].execEnd = Clock + 1;
					setQueueArray(newQueueArray);
				}
			}
		}
		for (let index = 0; index < StoreNumber; index++) {
			if (StoreStations[index].busy === 1) {
				if (StoreStations[index].T === -1) {
					let result = StoreStations[index].V;
					newWriteMemory.push({
						address: StoreStations[index].address,
						value: result,
						instructionIndex: StoreStations[index].instructionIndex,
						key: StoreStations[index].key,
					});
				} else if (StoreStations[index].T === 0) {
					let newQueueArray = [...QueueArray];
					newQueueArray[StoreStations[index].instructionIndex].execEnd = Clock + 1;
					setQueueArray(newQueueArray);
				}
			}
		}
		setReadyRegisters([...ReadyRegisters, ...newReadyResults]);
		setWriteMemory([...WriteMemory, ...newWriteMemory]);
		setDetectChange(!DetectChange);
	};

	useEffect(() => {
		if (ReadyRegisters.length !== 0 || WriteMemory.length !== 0) {
			let firstInReady = ReadyRegisters.sort((a, b) => a.instructionIndex - b.instructionIndex)[0];
			let firstInWrite = WriteMemory.sort((a, b) => a.instructionIndex - b.instructionIndex)[0];
			let isReady;
			if (firstInReady && firstInWrite) {
				isReady = firstInReady.instructionIndex > firstInWrite.instructionIndex ? true : false;
			} else if (firstInReady) isReady = true;
			else if (firstInWrite) isReady = false;

			if (isReady) {
				for (let index = 0; index < AddAndSubNumber; index++) {
					if (firstInReady.key === AddAndSubStations[index].Qj) {
						let newAddAndSubStations = [...AddAndSubStations];
						newAddAndSubStations[index].Qj = 0;
						newAddAndSubStations[index].Vj = firstInReady.value;
						setAddAndSubStations(newAddAndSubStations);
					} else if (firstInReady.key === AddAndSubStations[index].Qk) {
						let newAddAndSubStations = [...AddAndSubStations];
						newAddAndSubStations[index].Qk = 0;
						newAddAndSubStations[index].Vk = firstInReady.value;
						setAddAndSubStations(newAddAndSubStations);
					}
					if (AddAndSubStations[index].key === firstInReady.key) {
						let newQueueArray = [...QueueArray];
						newQueueArray[AddAndSubStations[index].instructionIndex].writeBack = Clock;
						setQueueArray(newQueueArray);
						let newAddAndSubStations = [...AddAndSubStations];
						newAddAndSubStations[index].busy = 0;
						newAddAndSubStations[index].op = "";
						newAddAndSubStations[index].Qj = 0;
						newAddAndSubStations[index].Qk = 0;
						newAddAndSubStations[index].Vj = 0;
						newAddAndSubStations[index].Vk = 0;
						newAddAndSubStations[index].T = 0;
						newAddAndSubStations[index].instructionIndex = 0;

						setAddAndSubStations(newAddAndSubStations);
					}
				}
				for (let index = 0; index < MulAndDivNumber; index++) {
					if (firstInReady.key === MulAndDivStations[index].Qj) {
						let newMulAndDivStations = [...MulAndDivStations];
						newMulAndDivStations[index].Qj = 0;
						newMulAndDivStations[index].Vj = firstInReady.value;
						setMulAndDivStations(newMulAndDivStations);
					} else if (firstInReady.key === MulAndDivStations[index].Qk) {
						let newMulAndDivStations = [...MulAndDivStations];
						newMulAndDivStations[index].Qk = 0;
						newMulAndDivStations[index].Vk = firstInReady.value;
						setMulAndDivStations(newMulAndDivStations);
					}
					if (firstInReady.key === MulAndDivStations[index].key) {
						let newQueueArray = [...QueueArray];
						newQueueArray[MulAndDivStations[index].instructionIndex].writeBack = Clock;
						setQueueArray(newQueueArray);
						let newMulAndDivStations = [...MulAndDivStations];
						newMulAndDivStations[index].busy = 0;
						newMulAndDivStations[index].op = "";
						newMulAndDivStations[index].Qj = 0;
						newMulAndDivStations[index].Qk = 0;
						newMulAndDivStations[index].Vj = 0;
						newMulAndDivStations[index].Vk = 0;
						newMulAndDivStations[index].T = 0;
						newMulAndDivStations[index].instructionIndex = 0;

						setMulAndDivStations(newMulAndDivStations);
					}
				}
				for (let index = 0; index < LoadNumber; index++) {
					if (LoadStations[index].key === firstInReady.key) {
						let newQueueArray = [...QueueArray];
						newQueueArray[LoadStations[index].instructionIndex].writeBack = Clock;
						setQueueArray(newQueueArray);
						let newLoadStations = [...LoadStations];
						newLoadStations[index].busy = 0;
						newLoadStations[index].address = 0;
						newLoadStations[index].T = 0;

						setLoadStations(newLoadStations);
					}
				}
				for (let index = 0; index < StoreNumber; index++) {
					if (firstInReady.key === StoreStations[index].Q) {
						let newQueueArray = [...QueueArray];
						newQueueArray[StoreStations[index].instructionIndex].writeBack = Clock;
						setQueueArray(newQueueArray);
						let newStoreStations = [...StoreStations];
						newStoreStations[index].Q = 0;
						newStoreStations[index].V = firstInReady.value;
						setStoreStations(newStoreStations);
					}
				}
				for (let index = 0; index <= RegisterFileNumber; index++) {
					if (firstInReady.key === RegisterFile[index].Q) {
						let newRegisterFile = [...RegisterFile];
						newRegisterFile[index].Q = 0;
						newRegisterFile[index].V = firstInReady.value;
						setRegisterFile(newRegisterFile);
					}
				}
				let newReadyRegisters = [...ReadyRegisters].filter(
					(ready) => ready.key !== firstInReady.key
				);
				setReadyRegisters(newReadyRegisters);
			} else {
				Memory[firstInWrite.address] = firstInWrite.value;
				for (let index = 0; index < StoreNumber; index++) {
					if (StoreStations[index].key === firstInWrite.key) {
						let newStoreStations = [...StoreStations];
						newStoreStations[index].busy = 0;
						newStoreStations[index].address = 0;
						newStoreStations[index].V = 0;
						newStoreStations[index].Q = 0;
						newStoreStations[index].T = 0;
						newStoreStations[index].instructionIndex = 0;
						setStoreStations(newStoreStations);
					}
				}
				let newWriteMemory = [...WriteMemory].filter((write) => write.key !== firstInWrite.key);
				setWriteMemory(newWriteMemory);
			}
		}
	}, [DetectChange]);

	const runCycle = () => {
		decrementTime();
		checkFinished();
		if (QueueIndex !== QueueArray.length) {
			let currentInstruction = QueueArray[QueueIndex];
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

									if (typeof src2Value === "string") {
										newAddAndSubStations[index].Qk = src2Value;
									} else {
										newAddAndSubStations[index].Vk = src2Value;
									}
									if (typeof src1Value === "string") {
										newAddAndSubStations[index].Qj = src1Value;
									} else {
										newAddAndSubStations[index].Vj = src1Value;
									}
									setAddAndSubStations(newAddAndSubStations);
									setRegisterKey(destination, stationKey);
									break;
								}
							}
							let newQueueArray = [...QueueArray];
							newQueueArray[QueueIndex].issue = Clock + 1;
							setQueueArray(newQueueArray);
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
									if (opCode === "MUL.D") newMulAndDivStations[index].T = MulLatency;
									else newMulAndDivStations[index].T = DivLatency;

									newMulAndDivStations[index].instructionIndex = QueueIndex;

									let src1Value = getRegisterValue(src1);
									let src2Value = getRegisterValue(src2);
									if (typeof src1Value === "string") {
										newMulAndDivStations[index].Qj = src1Value;
									} else {
										newMulAndDivStations[index].Vj = src1Value;
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
							let newQueueArray = [...QueueArray];
							newQueueArray[QueueIndex].issue = Clock + 1;
							setQueueArray(newQueueArray);
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
							let newQueueArray = [...QueueArray];
							newQueueArray[QueueIndex].issue = Clock + 1;
							setQueueArray(newQueueArray);
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
							let newQueueArray = [...QueueArray];
							newQueueArray[QueueIndex].issue = Clock + 1;
							setQueueArray(newQueueArray);
							setQueueIndex(QueueIndex + 1);
						}
					}
					break;
			}
		}
		setClock(Clock + 1);
	};

	return (
		<Container className="App">
			<QueueTable instructions={QueueArray} />
			<Row>
				<Col sm={6}>
					<h3 className="fitWidth">AddAndSubStations</h3>
					<ALUStationsTable isAdd={true} stations={AddAndSubStations} key="AddAndSubStations" />
				</Col>
				<Col sm={6}>
					<h3 className="fitWidth">MulAndDivStations</h3>
					<ALUStationsTable isAdd={false} stations={MulAndDivStations} key="MulAndDivStations" />
				</Col>
			</Row>
			<Row>
				<Col sm={4}>
					<h3 className="fitWidth">LoadStations</h3>
					<LoadStationsTable stations={LoadStations} key="LoadStations" />
					<h1>{Clock}</h1>
					<Button onClick={handleSetup}>Start</Button>
					<Button onClick={runCycle}>Next Cycle</Button>
				</Col>
				<Col sm={4}>
					<h3 className="fitWidth">StoreStations</h3>
					<StoreStationsTable stations={StoreStations} key="StoreStations" />
				</Col>
				<Col className="ms-auto" sm={2}>
					<h3 className="fitWidth">RegisterFile</h3>
					<RegisterFileTable registers={RegisterFile} key="RegisterFile" />
				</Col>
			</Row>
		</Container>
	);
}

export default App;
