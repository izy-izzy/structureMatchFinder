$( document ).ready(function() {

	var indexA = 0;
	var indexB = 0;
	var outputA = [];
	var outputB = [];
	var matchIndex = 0;
	while ((indexA < moleculeA.length) || (indexB < moleculeB.length)){
		console.log("indexA:", indexA, "indexB:", indexB);
		//fill values (tail happens)
		if (indexB >= moleculeB.length || indexA >= moleculeA.length){
			if (indexB >= moleculeB.length){
				for (var tailA = indexA; tailA < moleculeA.length; tailA++){
					outputA[matchIndex] = moleculeA[tailA];
					outputB[matchIndex] = {id:"-|-"};
					matchIndex++;
					indexA++;
				}
			}
			if (indexA >= moleculeA.length){
				for (var tailB = indexB; tailB < moleculeB.length; tailB++){
					outputB[matchIndex] = moleculeB[tailB];
					outputA[matchIndex] = {id:"-|-"};
					matchIndex++;
					indexB++;
				}
			}
		} else {
			var skipAStructuresCount = Number.MAX_SAFE_INTEGER;
			var skipBStructuresCount = Number.MAX_SAFE_INTEGER;
			if (indexA < moleculeA.length){
				for (var matchB = indexB; matchB < moleculeB.length; matchB++){
					if (moleculeA[indexA].id === moleculeB[matchB].id){
						skipBStructuresCount = matchB - indexB;
						break;
					}
				}
			}
			if (indexB < moleculeB.length){
				for (var matchA = indexA; matchA < moleculeA.length; matchA++){
					if (moleculeB[indexB].id === moleculeA[matchA].id){
						skipAStructuresCount = matchA - indexA;
						break;
					}
				}
			}
			console.log("skipBStructuresCount",skipBStructuresCount);
			console.log("skipAStructuresCount",skipAStructuresCount);
			// match on both molecules
			if (skipAStructuresCount === skipBStructuresCount){
				outputA[matchIndex] = moleculeA[indexA];
				indexA++;
				outputB[matchIndex] = moleculeB[indexB];
				indexB++;
				matchIndex++;
			// molecule A structures will be skipped
			} else if (skipAStructuresCount < skipBStructuresCount) {
				for (var matchDiffIndex = 0; matchDiffIndex < skipAStructuresCount; matchDiffIndex++){
					outputA[matchIndex] = moleculeA[indexA];
					indexA++;
					outputB[matchIndex] = {id:"°°°"};
					matchIndex++;
				}
			// molecule B structures will be skipped
			} else {
				for (var matchDiffIndex = 0; matchDiffIndex < skipBStructuresCount; matchDiffIndex++){
					outputB[matchIndex] = moleculeB[indexB];
					indexB++;
					outputA[matchIndex] = {id:"°°°"};
					matchIndex++
				}
			}
		}
		console.log("---------------------------------------")
	}

	$("#moleculeA").append("<h2>MOLECULE A</div>");
	for (modAStruct of moleculeA){
		$("#moleculeA").append("<div>"+JSON.stringify(modAStruct.id)+"</div>");
	}

	$("#moleculeB").append("<h2>MOLECULE B</h2>");
	for (modBStruct of moleculeB){
		$("#moleculeB").append("<div>"+JSON.stringify(modBStruct.id)+"</div>");
	}

	$("#moleculeAafter").append("<h2>MOLECULE A AFTER</div>");
	for (modAStructOut of outputA){
		$("#moleculeAafter").append("<div>"+JSON.stringify(modAStructOut.id)+"</div>");
	}

	$("#moleculeBafter").append("<h2>MOLECULE B AFTER</h2>");
	for (modBStructOut of outputB){
		$("#moleculeBafter").append("<div>"+JSON.stringify(modBStructOut.id)+"</div>");
	}

});
