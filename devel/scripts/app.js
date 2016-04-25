$( document ).ready(function() {

	var indexA = 0;
	var indexB = 0;
	var outputA = [];
	var outputB = [];
	var matchIndex = 0;

	var solutions = [];

	function deepCopyArray(inputArray){
		var arrOut = [];
		for (var i = 0; i < inputArray.length; i++){
			//console.log("iiiiii:"+i);
			arrOut[i] = {
				id : inputArray[i].id
			}
		}
		return arrOut;
	}

	//var testArray = deepCopyArray(moleculeA);
	/*console.log(moleculeA,testArray);
	moleculeA[0].id = "X";
	console.log(moleculeA,testArray);*/

	computeTail(moleculeA, moleculeB, indexA, indexB, outputA, outputB, matchIndex);

	function computeTail(inputArrayA, inputArrayB, indexA, indexB, outputArrayA, outputArrayB, outputArrayIndex){
		if (( indexA < inputArrayA.length) || (indexB < inputArrayB.length)){
			console.log("indexA:", indexA, "indexB:", indexB, "letters:", inputArrayA[indexA], inputArrayB[indexB]);
			console.log("arrA:", outputArrayA ,"arrB:", outputArrayB, "outputArrayIndex:", outputArrayIndex);
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
					for (var tailA = iA; tailA < inputArrA.length; tailA++){
						outputArrA[outputArrIndex] = inputArrA[tailA];
						outputArrB[outputArrIndex] = {id:"-"};
						outputArrIndex++;
						iA++;
					}
					solutions.push({
						outputArrayA : outputArrA,
						outputArrayB : outputArrB
					});
				}
				if (indexA >= inputArrayA.length){
					var inputArrA = deepCopyArray(inputArrayA);
					var inputArrB = deepCopyArray(inputArrayB);
					var iA = indexA;
					var iB = indexB;
					var outputArrA = deepCopyArray(outputArrayA);
					var outputArrB = deepCopyArray(outputArrayB);
					var outputArrIndex = outputArrayIndex;
					for (var tailB = iB; tailB < inputArrB.length; tailB++){
						outputArrB[outputArrIndex] = inputArrB[tailB];
						outputArrA[outputArrIndex] = {id:"-"};
						outputArrIndex++;
						iB++;
					}
					solutions.push({
						outputArrayA : outputArrA,
						outputArrayB : outputArrB
					});
				}
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
				console.log("matchesA",matchesA, "matchesB",matchesB);
				// molecule A structures will be skipped
				if (matchesA.length == 0){
					var inputArrA = deepCopyArray(inputArrayA);
					var inputArrB = deepCopyArray(inputArrayB);
					var iA = indexA;
					var iB = indexB;
					var outputArrA = deepCopyArray(outputArrayA);
					var outputArrB = deepCopyArray(outputArrayB);
					var outputArrIndex = outputArrayIndex;
					for (var tailA = 0; tailA < (inputArrA.length - iA); tailA){
						outputArrA[outputArrIndex] = inputArrA[iA];
						iA++;
						outputArrB[outputArrIndex] = {id:"°"};
						outputArrIndex++;
					}
					for (var tailB = 0; tailB < (inputArrB.length - iB); tailB){
						outputArrB[outputArrIndex] = inputArrB[iB];
						iB++;
						outputArrA[outputArrIndex] = {id:"°"};
						outputArrIndex++;
					}
					solutions.push({
						outputArrayA : outputArrA,
						outputArrayB : outputArrB
					});
				}
				if (matchesB.length == 0){
					var inputArrA = deepCopyArray(inputArrayA);
					var inputArrB = deepCopyArray(inputArrayB);
					var iA = indexA;
					var iB = indexB;
					var outputArrA = deepCopyArray(outputArrayA);
					var outputArrB = deepCopyArray(outputArrayB);
					var outputArrIndex = outputArrayIndex;
					for (var tailB = 0; tailB < (inputArrB.length - iB); tailB){
						outputArrB[outputArrIndex] = inputArrB[iB];
						iB++;
						outputArrA[outputArrIndex] = {id:"°"};
						outputArrIndex++;
					}
					for (var tailA = 0; tailA < (inputArrA.length - iA); tailA){
						outputArrA[outputArrIndex] = inputArrA[iA];
						iA++;
						outputArrB[outputArrIndex] = {id:"°"};
						outputArrIndex++;
					}
					solutions.push({
						outputArrayA : outputArrA,
						outputArrayB : outputArrB
					});
				}
				for (matchAIndex of matchesA){
					console.log("matchAIndex", matchAIndex);
					var inputArrA = deepCopyArray(inputArrayA);
					var inputArrB = deepCopyArray(inputArrayB);
					var iA = indexA;
					var iB = indexB;
					var outputArrA = deepCopyArray(outputArrayA);
					var outputArrB = deepCopyArray(outputArrayB);
					var outputArrIndex = outputArrayIndex;
					for (var matchDiffIndex = 0; matchDiffIndex < matchAIndex; matchDiffIndex++){
						//console.log("pogress A - " + matchDiffIndex +" of "+matchAIndex);
						outputArrA[outputArrIndex] = inputArrA[iA];
						iA++;
						outputArrB[outputArrIndex] = {id:"°"};
						outputArrIndex++;
					}
					outputArrA[outputArrIndex] = inputArrA[iA];
					iA++;
					outputArrB[outputArrIndex] = inputArrB[iB];
					iB++;
					outputArrIndex++;
					computeTail(inputArrA,inputArrB, iA, iB, outputArrA, outputArrB, outputArrIndex);
					console.log("arrA:", outputArrA ,"arrB:", outputArrB, "outputArrayIndex:", outputArrIndex);
				}
				// molecule B structures will be skipped
				for (matchBIndex of matchesB){
					console.log("matchBIndex", matchBIndex);
					var inputArrA = deepCopyArray(inputArrayA);
					var inputArrB = deepCopyArray(inputArrayB);
					var iA = indexA;
					var iB = indexB;
					var outputArrA = deepCopyArray(outputArrayA);
					var outputArrB = deepCopyArray(outputArrayB);
					var outputArrIndex = outputArrayIndex;
					for (var matchDiffIndex = 0; matchDiffIndex < matchBIndex; matchDiffIndex++){
						//console.log("progress B - " + matchDiffIndex +" of "+matchBIndex);
						outputArrB[outputArrIndex] = inputArrB[iB];
						iB++;
						outputArrA[outputArrIndex] = {id:"°"};
						outputArrIndex++
					}
					outputArrA[outputArrIndex] = inputArrA[iA];
					iA++;
					outputArrB[outputArrIndex] = inputArrB[iB];
					iB++;
					outputArrIndex++;
					console.log("arrA:", outputArrA ,"arrB:", outputArrB, "outputArrayIndex:", outputArrIndex);
					computeTail(inputArrA,inputArrB, iA, iB, outputArrA, outputArrB, outputArrIndex);
				}
			}
		} else {
			solutions.push({
				outputArrayA : outputArrayA,
				outputArrayB : outputArrayB
			});
		}
		console.log("---------------------------------------")
	}

	console.log(solutions);

	$("#moleculeA").append("<h2>Molecule A</div>");
	for (modAStruct of moleculeA){
		$("#moleculeA").append("<div class='struct'>"+modAStruct.id+"</div>");
	}

	$("#moleculeB").append("<h2>Molecule B</h2>");
	for (modBStruct of moleculeB){
		$("#moleculeB").append("<div class='struct'>"+modBStruct.id+"</div>");
	}

	var solutionCounter = 0;
	for (solution of solutions){
		$(".solutions").append("<div class='solution' id='c"+solutionCounter+"'></div>");
		$(".solution#c"+solutionCounter).append("<div class='molecule moleculeA'>"+"<div class='struct start'>A://</div>"+"</div>");
		$(".solution#c"+solutionCounter).append("<div class='molecule moleculeB'>"+"<div class='struct start'>B://</div>"+"</div>");
		for (struct of solution.outputArrayA){
			$(".solutions .solution#c"+solutionCounter+" .moleculeA").append("<div class='struct'>"+struct.id+"</div>");
		}
		for (struct of solution.outputArrayB){
			$(".solutions .solution#c"+solutionCounter+" .moleculeB").append("<div class='struct'>"+struct.id+"</div>");
		}

		solutionCounter++;
	}
});
