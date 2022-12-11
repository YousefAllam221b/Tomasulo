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
	constructor(key, busy, op, Vi, Vk, Qi, Qk, T) {
		this.key = key;
		this.busy = busy;
		this.op = op;
		this.Vi = Vi;
		this.Vk = Vk;
		this.Qi = Qi;
		this.Qk = Qk;
		this.T = T;
	}
}

class LoadStation {
	constructor(key, busy, address) {
		this.key = key;
		this.busy = busy;
		this.address = address;
	}
}

class StoreStation {
	constructor(key, busy, address, V, Q) {
		this.key = key;
		this.busy = busy;
		this.address = address;
		this.V = V;
		this.Q = Q;
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

let QueueArray = [];
let AddAndSubStations = [];
let MulAndDivStations = [];
let LoadStations = [];
let StoreStations = [];
let RegisterFile = [];
let Memory = [];
const AddAndSubNumber = 3;
const MulAndDivNumber = 2;
const RegisterFileNumber = 64;
const LoadNumber = 3;
const StoreNumber = 3;
const MemoryNumber = 100;

const LoadAndStoreLatency = 1;
const AddAndSubLatency = 2;
const MulAndDivLatency = 3;

let clock = 1;
let queueIndex = 0;

for (let index = 1; index <= AddAndSubNumber; index++) {
	let station = new ALUStation("A" + index, 0, 0, 0, 0, 0, 0, 0);
	AddAndSubStations.push(station);
}

for (let index = 1; index <= MulAndDivNumber; index++) {
	let station = new ALUStation("M" + index, 0, 0, 0, 0, 0, 0, 0);
	MulAndDivStations.push(station);
}

for (let index = 1; index <= LoadNumber; index++) {
	let station = new LoadStation("L" + index, 0, 0, 0, 0, 0, 0, 0);
	LoadStations.push(station);
}

for (let index = 1; index <= StoreNumber; index++) {
	let station = new StoreStation("L" + index, 0, 0, 0, 0, 0, 0, 0);
	StoreStations.push(station);
}

for (let index = 1; index <= RegisterFileNumber; index++) {
	let register = new Register("F" + index, 0, 0, 0, 0, 0, 0);
	RegisterFile.push(register);
}

for (let index = 1; index <= MemoryNumber; index++) {
	Memory.push(0);
}

Memory[1] = 5;
Memory[2] = 3;

var nextCycle = document.getElementById("nextCycle");

nextCycle.addEventListener(
	"click",
	function (e) {
		runCycle();
	},
	false
);

async function fetchInstructions() {
	try {
		instructions.forEach((instrcution) => {
			let instrcutionSplitted = instrcution.split(" ");
			QueueArray.push(
				new Queue(
					instrcutionSplitted[0],
					instrcutionSplitted[1],
					instrcutionSplitted[2],
					instrcutionSplitted[3],
					-1,
					-1,
					-1,
					-1
				)
			);
		});
	} catch (err) {
		console.log(err);
	}
}
fetchInstructions();
function decrementTime() {
	for (let index = 0; index < AddAndSubNumber; index++) {
		if (AddAndSubStations[index].busy === 1) {
			if (AddAndSubStations[index].Qi === 0 && AddAndSubStations[index].Qk === 0) {
				AddAndSubStations[index].T -= 1;
			}
		}
	}
	for (let index = 0; index < MulAndDivNumber; index++) {
		if (MulAndDivStations[index].busy === 1) {
			if (MulAndDivStations[index].Qi === 0 && MulAndDivStations[index].Qk === 0) {
				MulAndDivStations[index].T -= 1;
			}
		}
	}
	for (let index = 0; index < LoadNumber; index++) {
		if (LoadStations[index].busy === 1) {
			LoadStations[index].T -= 1;
		}
	}
	for (let index = 0; index < StoreNumber; index++) {
		if (StoreStations[index].busy === 1) {
			if (StoreStations[index].Q == 0) {
				StoreStations[index].T -= 1;
			}
		}
	}
}

let readyRegisters = [];
let writeRegisters = [];
function checkFinished() {
	for (let index = 0; index < AddAndSubNumber; index++) {
		if (AddAndSubStations[index].busy === 1) {
			if (AddAndSubStations[index].T === -1) {
				switch (AddAndSubStations[index].op) {
					case "ADD.D": {
						let result = AddAndSubStations[index].Vi + AddAndSubStations[index].Vk;
						readyRegisters.push({ key: AddAndSubStations[index].key, value: result });
					}
					case "SUB.D": {
						let result = AddAndSubStations[index].Vi - AddAndSubStations[index].Vk;
						readyRegisters.push({ key: AddAndSubStations[index].key, value: result });
					}
				}
			}
		}
	}
	for (let index = 0; index < MulAndDivNumber; index++) {
		if (MulAndDivStations[index].busy === 1) {
			if (MulAndDivStations[index].T === -1) {
				switch (MulAndDivStations[index].op) {
					case "MUL.D": {
						let result = MulAndDivStations[index].Vi * MulAndDivStations[index].Vk;
						readyRegisters.push({ key: MulAndDivStations[index].key, value: result });
					}
					case "DIV.D": {
						let result = MulAndDivStations[index].Vi / MulAndDivStations[index].Vk;
						readyRegisters.push({ key: MulAndDivStations[index].key, value: result });
					}
				}
			}
		}
	}
	for (let index = 0; index < LoadNumber; index++) {
		if (LoadStations[index].busy === 1) {
			if (LoadStations[index].T === -1) {
				console.log(LoadStations[index]);
				let result = Memory[LoadStations[index].address];
				readyRegisters.push({ key: LoadStations[index].key, value: result });
			}
		}
	}
	for (let index = 0; index < StoreNumber; index++) {
		if (StoreStations[index].busy === 1) {
			if (StoreStations[index].T === -1) {
				let result = StoreStations[index].V;
				writeRegisters.push({ key: StoreStations[index].address, value: result });
			}
		}
	}
	console.log("ready registers");
	console.log(readyRegisters);
	// Pipeline
	for (let registerIndex = 0; registerIndex < readyRegisters.length; registerIndex++) {
		let key = readyRegisters[registerIndex].key;
		let value = readyRegisters[registerIndex].value;
		for (let index = 0; index < AddAndSubNumber; index++) {
			if (key === AddAndSubStations[index].Qi) {
				AddAndSubStations[index].Qi = 0;
				AddAndSubStations[index].Vi = value;
			} else if (key === AddAndSubStations[index].Qk) {
				AddAndSubStations[index].Qk = 0;
				AddAndSubStations[index].Vk = value;
			}
		}
		for (let index = 0; index < MulAndDivNumber; index++) {
			if (key === MulAndDivStations[index].Qi) {
				MulAndDivStations[index].Qi = 0;
				MulAndDivStations[index].Vi = value;
			} else if (key === MulAndDivStations[index].Qk) {
				MulAndDivStations[index].Qk = 0;
				MulAndDivStations[index].Vk = value;
			}
		}
		for (let index = 0; index < StoreNumber; index++) {
			if (key === StoreStations[index].Q) {
				StoreStations[index].Q = 0;
				StoreStations[index].V = value;
			}
		}
	}
	writeBack();
}

function writeBack() {
	for (let index = 0; index < AddAndSubNumber; index++) {
		if (AddAndSubStations[index].busy === 1) {
			if (AddAndSubStations[index].T === -1) {
				let result;
				switch (AddAndSubStations[index].op) {
					case "ADD.D": {
						result = AddAndSubStations[index].Vi + AddAndSubStations[index].Vk;
						break;
					}
					case "SUB.D": {
						result = AddAndSubStations[index].Vi - AddAndSubStations[index].Vk;
						break;
					}
				}
				for (let registerIndex = 0; registerIndex < RegisterFileNumber; registerIndex++) {
					console.log(AddAndSubStations[index].op);
					console.log(result);
					if (RegisterFile[registerIndex].Q === AddAndSubStations[index].key) {
						console.log("hi");
						RegisterFile[registerIndex].Q = 0;
						RegisterFile[registerIndex].V = result;
						AddAndSubStations[index].busy = 0;
						AddAndSubStations[index].Qi = 0;
						AddAndSubStations[index].Qk = 0;
						AddAndSubStations[index].Vi = 0;
						AddAndSubStations[index].Vk = 0;
						break;
					}
				}
			}
		}
	}
	for (let index = 0; index < MulAndDivNumber; index++) {
		if (MulAndDivStations[index].busy === 1) {
			if (MulAndDivStations[index].T === -1) {
				let result;
				switch (MulAndDivStations[index].op) {
					case "MUL.D": {
						result = MulAndDivStations[index].Vi * MulAndDivStations[index].Vk;
						break;
					}
					case "DIV.D": {
						result = MulAndDivStations[index].Vi / MulAndDivStations[index].Vk;
						break;
					}
				}
				for (let registerIndex = 0; registerIndex < RegisterFileNumber; registerIndex++) {
					if (RegisterFile[registerIndex].Q === MulAndDivStations[index].key) {
						RegisterFile[registerIndex].Q = 0;
						RegisterFile[registerIndex].V = result;
						MulAndDivStations[index].busy = 0;
						MulAndDivStations[index].Qi = 0;
						MulAndDivStations[index].Qk = 0;
						MulAndDivStations[index].Vi = 0;
						MulAndDivStations[index].Vk = 0;
						break;
					}
				}
			}
		}
	}

	for (let index = 0; index < LoadNumber; index++) {
		if (LoadStations[index].busy === 1) {
			if (LoadStations[index].T === -1) {
				let result;
				result = Memory[LoadStations[index].address];
				for (let registerIndex = 0; registerIndex < RegisterFileNumber; registerIndex++) {
					if (RegisterFile[registerIndex].Q === LoadStations[index].key) {
						RegisterFile[registerIndex].Q = 0;
						RegisterFile[registerIndex].V = result;
						LoadStations[index].busy = 0;
						LoadStations[index].address = 0;
						break;
					}
				}
			}
		}
	}

	for (let index = 0; index < writeRegisters.length; index++) {
		Memory[writeRegisters[index].key] = writeRegisters[index].value;
	}
}
function AddAndSubStationsChecker() {
	let freeStationKey = "";
	for (let index = 0; index < AddAndSubNumber; index++) {
		if (AddAndSubStations[index].busy === 0) {
			freeStationKey = AddAndSubStations[index].key;
			break;
		}
	}
	return freeStationKey;
}
function MulAndDivStationsChecker() {
	let freeStationKey = "";
	for (let index = 0; index < MulAndDivNumber; index++) {
		if (MulAndDivStations[index].busy === 0) {
			freeStationKey = MulAndDivStations[index].key;
			break;
		}
	}
	return freeStationKey;
}
function LoadStationsChecker() {
	let freeStationKey = "";
	for (let index = 0; index < LoadNumber; index++) {
		if (LoadStations[index].busy === 0) {
			freeStationKey = LoadStations[index].key;
			break;
		}
	}
	return freeStationKey;
}
function StoreStationsChecker() {
	let freeStationKey = "";
	for (let index = 0; index < StoreNumber; index++) {
		if (StoreStations[index].busy === 0) {
			freeStationKey = StoreStations[index].key;
			break;
		}
	}
	return freeStationKey;
}
function getRegisterValue(key) {
	for (let index = 0; index < RegisterFileNumber; index++) {
		if (RegisterFile[index].key === key) {
			if (RegisterFile[index].Q == 0) {
				return RegisterFile[index].V;
			} else {
				return RegisterFile[index].Q;
			}
		}
	}
}
function setRegisterKey(key, stationKey) {
	for (let index = 0; index < RegisterFileNumber; index++) {
		if (RegisterFile[index].key === key) {
			RegisterFile[index].Q = stationKey;
			break;
		}
	}
}
document.getElementById("clockCycle").innerHTML = clock;

function runCycle() {
	decrementTime();
	checkFinished();
	if (queueIndex !== QueueArray.length) {
		console.log(queueIndex);
		let currentInstruction = QueueArray[queueIndex];
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
								AddAndSubStations[index].busy = 1;
								AddAndSubStations[index].op = opCode;
								AddAndSubStations[index].T = AddAndSubLatency;
								let src1Value = getRegisterValue(src1);
								let src2Value = getRegisterValue(src2);
								if (typeof src1Value === "string") {
									AddAndSubStations[index].Qi = src1Value;
								} else {
									AddAndSubStations[index].Vi = src1Value;
								}

								if (typeof src2Value === "string") {
									AddAndSubStations[index].Qk = src2Value;
								} else {
									AddAndSubStations[index].Vk = src2Value;
								}
								setRegisterKey(destination, stationKey);
								break;
							}
						}

						queueIndex += 1;
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
								MulAndDivStations[index].busy = 1;
								MulAndDivStations[index].op = opCode;
								MulAndDivStations[index].T = MulAndDivLatency;
								let src1Value = getRegisterValue(src1);
								let src2Value = getRegisterValue(src2);
								if (typeof src1Value === "string") {
									MulAndDivStations[index].Qi = src1Value;
								} else {
									MulAndDivStations[index].Vi = src1Value;
								}

								if (typeof src2Value === "string") {
									MulAndDivStations[index].Qk = src2Value;
								} else {
									MulAndDivStations[index].Vk = src2Value;
								}
								setRegisterKey(destination, stationKey);
								break;
							}
						}

						queueIndex += 1;
					}
				}
				break;
			case "L.D":
				{
					let stationKey = LoadStationsChecker();
					if (stationKey) {
						for (let index = 0; index < MulAndDivNumber; index++) {
							if (LoadStations[index].key === stationKey) {
								LoadStations[index].busy = 1;
								LoadStations[index].address = parseInt(src1);
								LoadStations[index].T = LoadAndStoreLatency;
								setRegisterKey(destination, stationKey);
								break;
							}
						}
						queueIndex += 1;
					}
				}
				break;
			case "S.D":
				{
					let stationKey = StoreStationsChecker();
					if (stationKey) {
						for (let index = 0; index < MulAndDivNumber; index++) {
							if (StoreStations[index].key === stationKey) {
								StoreStations[index].busy = 1;
								StoreStations[index].address = src1;
								StoreStations[index].T = LoadAndStoreLatency;
								let value = getRegisterValue(destination);
								if (typeof value === "string") StoreStations[index].Q = value;
								if (typeof value === "number") StoreStations[index].V = value;
								break;
							}
						}

						queueIndex += 1;
					}
				}
				break;
		}
	}
	document.getElementById("clockCycle").innerHTML = clock;
	console.log("AddAndSubStations: ");
	console.log(AddAndSubStations);
	console.log("MulAndDivStations: ");
	console.log(MulAndDivStations);
	console.log("LoadStations: ");
	console.log(LoadStations);
	console.log("StoreStations: ");
	console.log(StoreStations);
	console.log("RegisterFile: ");
	console.log(RegisterFile);
	console.log("Queue: ");
	console.log(QueueArray);
	console.log(Memory);
	console.log("/////////////////////////");
}
