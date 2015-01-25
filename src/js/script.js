(function(fabric, document, SIZE, NUMCASE, GRID, reponse, words){
	var canvas = new fabric.Canvas('c', { selection: false });
	var i;
	var j;
	var k;
	var l;
	var origin = [];
	var end = [];
	var isDragging = false;
	var drawingLine;
	canvas.setDimensions({width: SIZE*NUMCASE + NUMCASE, height: SIZE*NUMCASE + NUMCASE});
	var LabeledRect = fabric.util.createClass(fabric.Rect, {
	  type: 'labeledRect',
	  initialize: function(options) {
	    options = options || {};
	    this.callSuper('initialize', options);
	    this.set('label', options.label || '');
	  },
	  toObject: function() {
	    return fabric.util.object.extend(this.callSuper('toObject'), {
	      label: this.get('label')
	    });
	  },
	  _render: function(ctx) {
	    this.callSuper('_render', ctx);
	    ctx.font = '20px Helvetica';
	    ctx.fillStyle = '#333';
	    ctx.fillText(this.label, -this.width/2 + 5, -this.height/2 + 20);
	  }
	});

	var isCrossedWordAValidWord = function isCrossedWordAValidWord() {
		var result = -1;
		var isHorizontal = origin[0] === end[0];
		var isVertical = origin[1] === end[1];
		var x;
		var first;
		var last;
		var word = '';
		if(isHorizontal) {
			first = Math.min(origin[1], end[1]);
			last = Math.max(origin[1], end[1]);
			for( x=first;x<=last; x++ ) {
				word += GRID[origin[0]][x];
			}
			return Math.max(words.indexOf(word), words.indexOf(word.split('').reverse().join('')));
		}else if (isVertical) {
			first = Math.min(origin[0], end[0]);
			last = Math.max(origin[0], end[0]);
			for( x=first;x<=last; x++ ) {
				word += GRID[x][origin[1]];
			}
			return Math.max(words.indexOf(word), words.indexOf(word.split('').reverse().join('')));
		}
		return result;
	};

	var crossFoundWord = function crossFoundWord(w) {
		var liWord = document.getElementById('words').getElementsByTagName('li');
		var liWordLength = liWord.length;
		for ( l = 0; l < liWordLength; l++ ) {
			if( liWord[l].textContent === w ) {
				liWord[l].className = "validate";
				break;
			}
		}
	};

	// init grid
	for (i = 0; i < NUMCASE; i++) {
		for (j = 0; j < NUMCASE; j++) {
			var rect = new LabeledRect({
				left: i*SIZE,
				top: j*SIZE,
				fill: 'white',
				stroke: 'black',
				width: SIZE,
				height: SIZE,
				label: GRID[j][i],
				selectable: false
			});
			canvas.add(rect);
		}
	}
	// init words
	// TODO eurk
	for(var uno = 0; uno < words.length; uno++) {
		var tmpLi = document.createElement('li');
		tmpLi.innerHTML = words[uno].toUpperCase();
		document.getElementById('words').appendChild(tmpLi);
	}

	canvas.on('mouse:down', function(options) {
		isDragging 	= true;
		var pointer = canvas.getPointer(options.e);
		var points 	= [ pointer.x, pointer.y, pointer.x, pointer.y ];
		origin = [Math.floor(points[1]/SIZE),Math.floor(points[0]/SIZE)];
		drawingLine = new fabric.Line(points, {
					stroke: 'black',
					strokeLineCap: 'round',
					strokeWidth: SIZE/2,
					originX: 'center',
					originY: 'center'
				});
		canvas.add(drawingLine);
	});

	canvas.on('mouse:move', function(options) {
		if(isDragging) {
			var pointer = canvas.getPointer(options.e);
			drawingLine.set({ x2: pointer.x, y2: pointer.y });
			canvas.renderAll();
		}
	});
	
	canvas.on('mouse:up', function(options) {
		isDragging = false;
		var pointer = canvas.getPointer(options.e);
		var position = [pointer.x, pointer.y];
		end = [Math.floor(position[1]/SIZE),Math.floor(position[0]/SIZE)];
		canvas.remove(drawingLine);
		if(origin[0] !== end[0] || origin[1] !== end[1]) {
			var isAWord = isCrossedWordAValidWord();
			if(isAWord !== -1) {
				var lineCoord = words[isAWord];
				lineCoord = origin.reverse().join('').concat(end.reverse().join('')).split('');
				lineCoord = lineCoord.map(function(map){return map*SIZE+SIZE/2;});
				var line = new fabric.Line(lineCoord, {
					stroke: 'black',
					strokeLineCap: 'round',
					strokeWidth: SIZE/2,
					originX: 'center',
					originY: 'center',
					selectable: false
				});
				crossFoundWord(words[isAWord]);
				words.splice(isAWord, 1);
				canvas.add(line);
				if(words.length === 0) {
					nextStep();
				}
			}
		}
		origin = [];
		end = [];
	});

	var nextStep = function nextStep() {
		document.getElementById('answer-container').style.display = 'block';
		document.getElementById('submit').addEventListener('click', answer, false);
		document.getElementById('answer').addEventListener('keydown', answer, false);
	};

	var answer = function answer(evt) {
		if(evt.type === 'keydown' && evt.keyCode === 13){
			document.getElementById('submit').click();
		}
		var userAnswer = document.getElementById('answer').value;
		if(userAnswer.toUpperCase() === reponse.toUpperCase()) {
			finalStep();
		}
	};

	var finalStep = function finalStep() {
		document.getElementById("playground").classList.toggle("flip");
	};
})(fabric, document, SIZE, NUMCASE, GRID, reponse, words);