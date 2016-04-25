$( document ).ready(function() {

	var indexA = 0;
	var indexB = 0;
	var outputA = [];
	var outputB = [];
	var matchIndex = 0;
	var startPenalty = 0;

	var solutions = [];
	var maxPenalty = Number.MAX_SAFE_INTEGER;

	function filterSolutions(){
		var filteredSolutions = [];
		for (var solution of solutions){
			var penalty = getPenalty(solution.arrayA, solution.arrayB);
			if (penalty <= maxPenalty){
				var arrayA = solution.arrayA;
				var arrayB = solution.arrayB;
				filteredSolutions.push({arrayA, arrayB});
			}
		}
		solutions = filteredSolutions;
	}

	function compareSolutions(solA, solB){
		if (solA.arrayA.length != solB.arrayA.length){
			return false;
		}
		for (var i = 0; i < solA.arrayA.length; i++){
			if ((solA.arrayA[i].id  != solB.arrayA[i].id ) ||
			    (solA.arrayA[i].gap != solB.arrayA[i].gap)){
				return false;
			}
			if ((solA.arrayB[i].id  != solB.arrayB[i].id ) ||
			    (solA.arrayB[i].gap != solB.arrayB[i].gap)){
				return false;
			}
		}
		return true;
	};

	function addSolution(arrayA, arrayB, penalty){
		//var penalty = getPenalty(arrayA, arrayB);
		if (penalty <= maxPenalty){
			maxPenalty = penalty;
			//solutions = [{arrayA,arrayB}];

			var match = false;
			for (sol of solutions){
				match = match || compareSolutions(sol, {arrayA, arrayB});
			}
			if (!match){
				solutions.push({arrayA,arrayB});
			}
		}
		filterSolutions();
	}

	function getPenalty(arrayA, arrayB){
		var penalty = 0;
		for (var a = 0; a < arrayA.length; a++){
			if (arrayA[a].gap){
				penalty++;
			}
		}
		for (var b = 0; b < arrayB.length; b++){
			if (arrayB[b].gap){
				penalty++;
			}
		}
		return penalty;
	}

	//console.log(getPenalty(moleculeA,moleculeB));

	function deepCopyArray(inputArray){
		var arrOut = [];
		for (var i = 0; i < inputArray.length; i++){
			//console.log("iiiiii:"+i);
			arrOut[i] = {
				id : inputArray[i].id,
				gap : inputArray[i].gap
			}
		}
		return arrOut;
	}

	//var testArray = deepCopyArray(moleculeA);
	/*console.log(moleculeA,testArray);
	moleculeA[0].id = "X";
	console.log(moleculeA,testArray);*/

	var d1 = new Date();
	var n1 = d1.getTime();

	computeTail(moleculeA, moleculeB, indexA, indexB, outputA, outputB, matchIndex, startPenalty);

	var d2 = new Date();
	var n2 = d2.getTime();

	console.log("ms:", d2-d1);

	function computeTail(inputArrayA, inputArrayB, indexA, indexB, outputArrayA, outputArrayB, outputArrayIndex, penalty){
		if (penalty > maxPenalty ){
			// penalty for this solution is at the moment higher than
			// penalty for already computed solution. Do not continue.
		} else {
			//console.log("continue");
			if (( indexA < inputArrayA.length) || (indexB < inputArrayB.length)){
				//fill values (tail happens)
				if (indexB >= inputArrayB.length || indexA >= inputArrayA.length){
					if (indexB >= inputArrayB.length){
						var inputArrA = deepCopyArray(inputArrayA);
						var inputArrB = deepCopyArray(inputArrayB);
						var iA = indexA;
						var iB = indexB;
						var outputArrA = deepCopyArray(outputArrayA);
						var outputArrB = deepCopyArray(outputArrayB);
						var outputArrIndex = outputArrayIndex;
						var pen = penalty;
						for (var tailA = iA; tailA < inputArrA.length; tailA++){
							outputArrA[outputArrIndex] = inputArrA[tailA];
							outputArrB[outputArrIndex] = {id:"-", gap:true};
							outputArrIndex++;
							pen++;
							iA++;
						}
						addSolution(outputArrA,outputArrB, pen);
					}
					if (indexA >= inputArrayA.length){
						var inputArrA = deepCopyArray(inputArrayA);
						var inputArrB = deepCopyArray(inputArrayB);
						var iA = indexA;
						var iB = indexB;
						var outputArrA = deepCopyArray(outputArrayA);
						var outputArrB = deepCopyArray(outputArrayB);
						var outputArrIndex = outputArrayIndex;
						var pen = penalty;
						for (var tailB = iB; tailB < inputArrB.length; tailB++){
							outputArrB[outputArrIndex] = inputArrB[tailB];
							outputArrA[outputArrIndex] = {id:"-", gap:true};
							outputArrIndex++;
							pen++;
							iB++;
						}
						addSolution(outputArrA,outputArrB,pen);
					}
				// no tail searching for mathes in both structures
				} else {
					var matchesA = [];
					var matchesB = [];
					if (indexA < inputArrayA.length){
						for (var matchB = indexB; matchB < inputArrayB.length; matchB++){
							if (inputArrayA[indexA].id === inputArrayB[matchB].id){
								matchesB.push(matchB - indexB);
							}
						}
					}
					if (indexB < inputArrayB.length){
						for (var matchA = indexA; matchA < inputArrayA.length; matchA++){
							if (inputArrayB[indexB].id === inputArrayA[matchA].id){
								matchesA.push(matchA - indexA);
							}
						}
					}
					// matches not found from B to A
					if (matchesA.length == 0){
						var inputArrA = deepCopyArray(inputArrayA);
						var inputArrB = deepCopyArray(inputArrayB);
						var iA = indexA;
						var iB = indexB;
						var outputArrA = deepCopyArray(outputArrayA);
						var outputArrB = deepCopyArray(outputArrayB);
						var outputArrIndex = outputArrayIndex;
						var pen = penalty;
						// fill with tail A
						for (var tailA = 0; tailA < (inputArrA.length - iA); tailA){
							outputArrA[outputArrIndex] = inputArrA[iA];
							iA++;
							outputArrB[outputArrIndex] = {id:"°", gap:true};
							pen++;
							outputArrIndex++;
						}
						// fill with tail B
						for (var tailB = 0; tailB < (inputArrB.length - iB); tailB){
							outputArrB[outputArrIndex] = inputArrB[iB];
							iB++;
							outputArrA[outputArrIndex] = {id:"°", gap:true};
							pen++;
							outputArrIndex++;
						}
						addSolution(outputArrA,outputArrB, pen);
					}
					// matches not found from A to B
					if (matchesB.length == 0){
						var inputArrA = deepCopyArray(inputArrayA);
						var inputArrB = deepCopyArray(inputArrayB);
						var iA = indexA;
						var iB = indexB;
						var outputArrA = deepCopyArray(outputArrayA);
						var outputArrB = deepCopyArray(outputArrayB);
						var outputArrIndex = outputArrayIndex;
						var pen = penalty;
						// fill with tail B
						for (var tailB = 0; tailB < (inputArrB.length - iB); tailB){
							outputArrB[outputArrIndex] = inputArrB[iB];
							iB++;
							pen++;
							outputArrA[outputArrIndex] = {id:"°", gap:true};
							outputArrIndex++;
						}
						// fill with tail A
						for (var tailA = 0; tailA < (inputArrA.length - iA); tailA){
							outputArrA[outputArrIndex] = inputArrA[iA];
							iA++;
							pen++;
							outputArrB[outputArrIndex] = {id:"°", gap:true};
							outputArrIndex++;
						}
						addSolution(outputArrA,outputArrB, pen);
					}
					//1 or more matches found from B to A
					for (matchAIndex of matchesA){
						var inputArrA = deepCopyArray(inputArrayA);
						var inputArrB = deepCopyArray(inputArrayB);
						var iA = indexA;
						var iB = indexB;
						var outputArrA = deepCopyArray(outputArrayA);
						var outputArrB = deepCopyArray(outputArrayB);
						var outputArrIndex = outputArrayIndex;
						var pen = penalty;
						// fill gaps
						for (var matchDiffIndex = 0; matchDiffIndex < matchAIndex; matchDiffIndex++){
							outputArrA[outputArrIndex] = inputArrA[iA];
							iA++;
							outputArrB[outputArrIndex] = {id:"°", gap:true};
							pen++;
							outputArrIndex++;
						}
						// copy match
						outputArrA[outputArrIndex] = inputArrA[iA];
						iA++;
						outputArrB[outputArrIndex] = inputArrB[iB];
						iB++;
						outputArrIndex++;
						computeTail(inputArrA,inputArrB, iA, iB, outputArrA, outputArrB, outputArrIndex, pen);
					}
					//1 or more matches found from A to B
					for (matchBIndex of matchesB){
						var inputArrA = deepCopyArray(inputArrayA);
						var inputArrB = deepCopyArray(inputArrayB);
						var iA = indexA;
						var iB = indexB;
						var outputArrA = deepCopyArray(outputArrayA);
						var outputArrB = deepCopyArray(outputArrayB);
						var outputArrIndex = outputArrayIndex;
						var pen = penalty;
						// fill gaps
						for (var matchDiffIndex = 0; matchDiffIndex < matchBIndex; matchDiffIndex++){
							outputArrB[outputArrIndex] = inputArrB[iB];
							iB++;
							outputArrA[outputArrIndex] = {id:"°", gap:true};
							pen++;
							outputArrIndex++
						}
						// copy match
						outputArrA[outputArrIndex] = inputArrA[iA];
						iA++;
						outputArrB[outputArrIndex] = inputArrB[iB];
						iB++;
						outputArrIndex++;
						computeTail(inputArrA,inputArrB, iA, iB, outputArrA, outputArrB, outputArrIndex, pen);
					}
				}
			} else {
				var outputArrA = deepCopyArray(outputArrayA);
				var outputArrB = deepCopyArray(outputArrayB);
				var pen = penalty;
				addSolution(outputArrA,outputArrB, pen);
			}
		}
	}

	//console.log(solutions);

	$("#moleculeA").append("<h2>Molecule A</div>");
	for (modAStruct of moleculeA){
		$("#moleculeA").append("<div class='struct'>"+modAStruct.id+"</div>");
	}

	$("#moleculeB").append("<h2>Molecule B</h2>");
	for (modBStruct of moleculeB){
		$("#moleculeB").append("<div class='struct'>"+modBStruct.id+"</div>");
	}

	var solutionCounter = 0;
	for (var solution of solutions){
		console.log("solution:",solution);
		var p = getPenalty(solution.arrayA, solution.arrayB);
		console.log("penalty: ", p, " of ", maxPenalty);
		$(".solutions").append("<div class='solution' id='c"+solutionCounter+"'></div>");
		$(".solution#c"+solutionCounter).append("<div class='molecule moleculeA'>"+"<div class='struct start'>A://</div>"+"</div>");
		$(".solution#c"+solutionCounter).append("<div class='molecule moleculeB'>"+"<div class='struct start'>B://</div>"+"</div>");
		for (struct of solution.arrayA){
			$(".solutions .solution#c"+solutionCounter+" .moleculeA").append("<div class='struct'>"+struct.id+"</div>");
		}
		for (struct of solution.arrayB){
			$(".solutions .solution#c"+solutionCounter+" .moleculeB").append("<div class='struct'>"+struct.id+"</div>");
		}

		solutionCounter++;
	}
});
