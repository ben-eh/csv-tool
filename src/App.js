import { Typography, Input, Button } from '@mui/material';
import './App.css';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';

// let fr = new FileReader();

function App() {

	// state variables for monkey sheet
	const [monkeyHeaderRow, setMonkeyHeaderRow] = useState([]);
	const [monkeyData, setMonkeyData] = useState([]);

	// state variables for master sheet
	const [masterHeaderRow, setMasterHeaderRow] = useState([]);
	const [masterData, setMasterData] = useState([]);
	const [masterEmailList, setMasterEmailList] = useState([]);
	const [masterEmailDuplicates, setMasterEmailDuplicates] = useState([]);

	// useEffect(() => {
	// 	const duplicatesArray = masterData.reduce((acc, curr) => {
	// 		if (acc.includes(curr.email)) sussEmails.push(acc.email);
	// 		return [...acc, curr.email];
	// 	}, []);
	// 	if (sussEmails.length > 0) setMasterEmailDuplicates(sussEmails);
	// }, [masterData, masterEmailList])

	useEffect(() => {
		const duplicates = masterData.filter((outerRow) => {
			const count = masterData.filter((innnerRow) => {
				return outerRow.email === innnerRow.email
			}).length;
			return count > 1;
		}).map((item) => {
			return item.email;
		})
		// console.log(duplicates);
	})

	useEffect(() => {
		// get master list of emails
		const emailList = masterData.reduce((acc, curr) => {
			if (!acc.includes(curr.email)) {
				return [...acc, curr.email];
			}
			return acc;
		}, []);
		// get unique list (in case of duplicates)
		const uniqueEmailList = getUniqueEmailsMasterList(emailList);
		setMasterEmailList(uniqueEmailList);
	}, [masterData, masterHeaderRow]);

	const getUniqueEmailsMasterList = (list) => {
		let seen = {};
		return list.filter((item) => {
			return seen.hasOwnProperty(item) ? false : (seen[item] = true);
		})
	}

	const getUniqueRows = (list) => {
		let alreadyInList = [];
		return list.filter((obj) => {
			if (!alreadyInList.includes(obj.email)) {
				alreadyInList.push(obj.email);
				return true;
			} else {
				return false;
			}
		})
	}

	// const emailIndex = data[0].indexOf('email');

	// if (monkeyHeaderRow.length > 0) {
	// 	console.log('Monkey Survery Data');
	// 	console.log(monkeyHeaderRow);
	// 	console.log(monkeyData);
	// }

	// if (masterHeaderRow.length > 0 ) {
	// 	console.log('Master Sheet Data');
	// 	console.log(masterHeaderRow);
	// 	console.log(masterData);
	// 	console.log(`This is the master email list: ${masterEmailList}`);
	// 	console.log(`duplicate email addresses: ${masterEmailDuplicates}`);
	// }



	// console.log(emailIndex);

	const monkeySurveyUpload = (e) => {
		const file = e.target.files[0];
		Papa.parse(file, {
			complete: (results) => {
				setMonkeyHeaderRow(results.data[0]);
			},
		});
		Papa.parse(file, {
			header: true,
			complete: (results) => {
				setMonkeyData(getUniqueRows(results.data));
			},
		});
	}

	const masterSurveyUpload = (e) => {
		const file = e.target.files[0];
		Papa.parse(file, {
			complete: (results) => {
				setMasterHeaderRow(results.data[0]);
			},
		});
		Papa.parse(file, {
			header: true,
			complete: (results) => {
				setMasterData(results.data);
			},
		});
	}

	const processBothCSVs = () => {
		if (monkeyData.length === 0 || masterData.length === 0) {
			alert('please check that you have both csv files chosen, or check that there are rows in both files')
			return;
		} else {
			const test = getNewRows();
			// console.log('Monkey Data:');
			// monkeyData.forEach((row) => {
			// 	console.log(row);
			// })
			// console.log('Master Data:');
			// masterData.forEach((row) => {
			// 	console.log(row);
			// })
			console.log('These are the new rows:');
			console.log(test);
		}
	}

	const getNewRows = () => {
		return monkeyData.filter((row) => {
			return !masterEmailList.includes(row.email);
		})
	}

	return (
		<div className="App">
			<Typography>
				Drag in your Survey Monkey csv here
			</Typography>
			<Input
				type="file"
				onChange={monkeySurveyUpload}
			/>
			<Typography>
				Drag in your Master Excel sheet here
			</Typography>
			<Input
				type="file"
				onChange={masterSurveyUpload}
			/>
			<br />
			<Button
				variant="contained"
				onClick={processBothCSVs}
			>
				Process
			</Button>
		</div>
	);
}

export default App;


// 1 - load file
// 2 - create a file reader
// 3 - read contents of file (line 12)
// 4 - when reading is done, result property will be populated with the content
// 5 - when reading is done and result is populated, the onloadend callback will be called