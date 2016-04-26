$( document ).ready(function() {

	var solutions = []; // final solutions
	var maxPenalty = Number.MAX_SAFE_INTEGER;

	var gapObject = {id:"°", gap:true}; // used to insert gaps strutures

	// actual run
	var d1 = new Date();
	var n1 = d1.getTime();

	computeTail(moleculeA, moleculeB, 0, 0, [], [], 0);

	var d2 = new Date();
	var n2 = d2.getTime();
	var completionTime = n2-n1 + " ms";
	console.log("ms:", n2-n1);
	// end of actual run

	function computeTail(inputArrayA, inputArrayB, indexA, indexB, outputArrayA, outputArrayB, penalty){
		if (penalty > maxPenalty ){
			// penalty for this solution is at the moment higher than
			// penalty for already computed solution. Do not continue.
		} else {
			// if at least one of the arrays are not depleted
			if (( indexA < inputArrayA.length) || (indexB < inputArrayB.length)){
				//fill values (tail happens)
				if (indexB >= inputArrayB.length || indexA >= inputArrayA.length){
					if (indexB >= inputArrayB.length){
						var dCOB = deepCopyObjects(indexA, indexB, outputArrayA, outputArrayB, penalty);
						var gapCountB = inputArrayA.length - dCOB.indexA;
						var uDCOB = addGaps(inputArrayA, inputArrayB, dCOB.outputArrayA, dCOB.outputArrayB, false, gapCountB, dCOB.indexA, dCOB.indexB, dCOB.penalty);
						addSolution(uDCOB.outputArrayA,uDCOB.outputArrayB, uDCOB.penalty);
					}
					if (indexA >= inputArrayA.length){
						var dCOA = deepCopyObjects(indexA, indexB, outputArrayA, outputArrayB, penalty);
						var gapCountA = inputArrayB.length - dCOA.indexB;
						var uDCOA = addGaps(inputArrayA, inputArrayB, dCOA.outputArrayA, dCOA.outputArrayB, true, gapCountA, dCOA.indexA, dCOA.indexB, dCOA.penalty);
						addSolution(uDCOA.outputArrayA,uDCOA.outputArrayB,uDCOA.penalty);
					}
				// no tail searching for mathes in both structures
				} else {
					var matchesBtoA = getMatches(inputArrayA, inputArrayB, indexA, indexB, false);
					var matchesAtoB = getMatches(inputArrayA, inputArrayB, indexA, indexB, true);

					// matches not found from B to A
					// this may happen when comparator function is dependend on "distance in 2D or 3D space".
					if (matchesBtoA.length === 0){
						var dCOBA = deepCopyObjects(indexA, indexB, outputArrayA, outputArrayB, penalty);
						// put gap to B
						var uDCOBA = addGaps(inputArrayA, inputArrayB, dCOBA.outputArrayA, dCOBA.outputArrayB, false, 1, dCOBA.indexA, dCOBA.indexB, dCOBA.penalty);
						computeTail(inputArrayA,inputArrayB, uDCOBA.indexA, uDCOBA.indexB, uDCOBA.outputArrayA, uDCOBA.outputArrayB, uDCOBA.penalty);
					}
					// matches not found from A to B
					// this may happen when comparator function is dependend on "distance in 2D or 3D space".
					if (matchesAtoB.length === 0){
						var dCOAB = deepCopyObjects(indexA, indexB, outputArrayA, outputArrayB, penalty);
						// put gap to A
						var uDCOAB = addGaps(inputArrayA, inputArrayB, dCOAB.outputArrayA, dCOAB.outputArrayB, true, 1, dCOAB.indexA, dCOAB.indexB, dCOAB.penalty);
						computeTail(inputArrayA,inputArrayB, uDCOAB.indexA, uDCOAB.indexB, uDCOAB.outputArrayA, uDCOAB.outputArrayB, uDCOAB.penalty);
					}
					//1 or more matches found from B to A
					for (var matchAIndex of matchesBtoA){
						var dCOmA = deepCopyObjects(indexA, indexB, outputArrayA, outputArrayB, penalty);
						// fill gaps
						var uDCOmA = addGaps(inputArrayA, inputArrayB, dCOmA.outputArrayA, dCOmA.outputArrayB, false, matchAIndex, dCOmA.indexA, dCOmA.indexB, dCOmA.penalty);
						// copy match
						var pUDCOmA = progressBoth(inputArrayA, inputArrayB, uDCOmA.outputArrayA, uDCOmA.outputArrayB, uDCOmA.indexA, uDCOmA.indexB, 1);
						computeTail(inputArrayA,inputArrayB, pUDCOmA.indexA, pUDCOmA.indexB, pUDCOmA.outputArrayA, pUDCOmA.outputArrayB, uDCOmA.penalty);
					}
					//1 or more matches found from A to B
					for (var matchBIndex of matchesAtoB){
						var dCOmB = deepCopyObjects(indexA, indexB, outputArrayA, outputArrayB, penalty);
						// fill gaps
						var uDCOmB = addGaps(inputArrayA, inputArrayB, dCOmB.outputArrayA, dCOmB.outputArrayB, true, matchBIndex, dCOmB.indexA, dCOmB.indexB, dCOmB.penalty);
						var pUDCOmB = progressBoth(inputArrayA, inputArrayB, uDCOmB.outputArrayA, uDCOmB.outputArrayB, uDCOmB.indexA, uDCOmB.indexB, 1);
						computeTail(inputArrayA,inputArrayB, pUDCOmB.indexA, pUDCOmB.indexB, pUDCOmB.outputArrayA, pUDCOmB.outputArrayB, uDCOmB.penalty);
					}
				}
			// if both arrays are depleted add solution
			} else {
				var dCO = deepCopyObjects(indexA, indexB, outputArrayA, outputArrayB, penalty);
				addSolution(dCO.outputArrayA,dCO.outputArrayB, dCO.penalty);
			}
		}
	}

	function getMatches(inputArrayA, inputArrayB, indexA, indexB, fromAtoB){
		var matches = [];
		if (fromAtoB) {
			for (var matchB = indexB; matchB < inputArrayB.length; matchB++){
				if (inputArrayA[indexA].id === inputArrayB[matchB].id){
					matches.push(matchB - indexB);
				}
			}
		} else {
			for (var matchA = indexA; matchA < inputArrayA.length; matchA++){
				if (inputArrayB[indexB].id === inputArrayA[matchA].id){
					matches.push(matchA - indexA);
				}
			}
		}
		return matches;
	}

	function progressBoth(inputArrayA, inputArrayB, outputArrayA, outputArrayB, indexA, indexB, steps){
		for(var i = 0; i < steps; i++){
			outputArrayA.push(inputArrayA[indexA]);
			indexA++;
			outputArrayB.push(inputArrayB[indexB]);
			indexB++;
		}
		var objRet = ({
			inputArrayA : inputArrayA,
			inputArrayB : inputArrayB,
			outputArrayA : outputArrayA,
			outputArrayB : outputArrayB,
			indexA : indexA,
			indexB : indexB
		});
		return objRet;
	}

	// add gaps to A or B
	function addGaps(inputArrayA, inputArrayB, outputArrayA, outputArrayB, addGapsToA, count, indexA, indexB, penalty){
		if (addGapsToA){
			for (var i = 0; i < count; i++){
				outputArrayB.push(inputArrayB[indexB]);
				outputArrayA.push(gapObject);
				penalty++;
				indexB++;
			}
		} else {
			for (var j = 0; j < count; j++){
				outputArrayA.push(inputArrayA[indexA]);
				outputArrayB.push(gapObject);
				penalty++;
				indexA++;
			}
		}
		var objRet = ({
			outputArrayA : outputArrayA,
			outputArrayB : outputArrayB,
			indexA : indexA,
			indexB : indexB,
			penalty : penalty
		});
		return objRet;
	}

	// discards solutions that are in solutions and do not have lowest penalty
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

	// compare two solutions and returns boolean according to length of solutions
	function compareSolutions(solA, solB){
		if (solA.arrayA.length !== solB.arrayA.length){
			return false;
		}
		for (var i = 0; i < solA.arrayA.length; i++){
			if ((solA.arrayA[i].id  !== solB.arrayA[i].id ) ||
				(solA.arrayA[i].gap !== solB.arrayA[i].gap)){
				return false;
			}
			if ((solA.arrayB[i].id  !== solB.arrayB[i].id ) ||
				(solA.arrayB[i].gap !== solB.arrayB[i].gap)){
				return false;
			}
		}
		return true;
	}

	// adds solution to all solutions
	// solution is not added it match is already in solution or penalty is above actual maximal penaly
	function addSolution(arrayA, arrayB, penalty){
		if (penalty <= maxPenalty){
			maxPenalty = penalty;
			var match = false;
			for (var sol of solutions){
				match = match || compareSolutions(sol, {arrayA, arrayB});
			}
			if (!match){
				solutions.push({arrayA,arrayB});
				filterSolutions();
			}
		}
	}

	// returns penalty for current soltion
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

	// performes deep copy of array containing objects : {id:number, gap: boolean}
	function deepCopyArray(inputArray){
		var arrOut = [];
		for (var i = 0; i < inputArray.length; i++){
			arrOut[i] = {
				id : inputArray[i].id,
				gap : inputArray[i].gap
			};
		}
		return arrOut;
	}

	// performs deep copy of object
	// returns deep copy of object in object (properities name are: indexA, indexB, outputArrayA, outputArrayB, penalty)
	function deepCopyObjects(indexA, indexB, outputArrayA, outputArrayB, penalty){
		var obj = {
			indexA : indexA,
			indexB : indexB,
			outputArrayA : deepCopyArray(outputArrayA),
			outputArrayB : deepCopyArray(outputArrayB),
			penalty : penalty
		};
		return obj;
	}


	// ouput of input
	$("#moleculeA").append("<h2>Molecule A</div>");
	for (var modAStruct of moleculeA){
		$("#moleculeA").append("<div class='struct'>"+modAStruct.id+"</div>");
	}

	$("#moleculeB").append("<h2>Molecule B</h2>");
	for (var modBStruct of moleculeB){
		$("#moleculeB").append("<div class='struct'>"+modBStruct.id+"</div>");
	}

	// ouput of solutions
	var solutionCounter = 0;
	$(".solutions").append("<div>"+solutions.length+" solutions found in "+ completionTime+".</div>");
	for (var solution of solutions){
		$(".solutions").append("<div class='solution' id='c"+solutionCounter+"'></div>");

		$(".solution#c"+solutionCounter).append("<div class='molecule moleculeA'>"+"<div class='struct start'>A://</div>"+"</div>");
		$(".solution#c"+solutionCounter).append("<div class='molecule moleculeB'>"+"<div class='struct start'>B://</div>"+"</div>");
		for (var structA of solution.arrayA){
			$(".solutions .solution#c"+solutionCounter+" .moleculeA").append("<div class='struct'>"+structA.id+"</div>");
		}
		for (var structB of solution.arrayB){
			$(".solutions .solution#c"+solutionCounter+" .moleculeB").append("<div class='struct'>"+structB.id+"</div>");
		}
		solutionCounter++;
	}
});
