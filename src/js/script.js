(function(fabric, SIZE, GRID, words){
	var canvas = new fabric.Canvas('c', { selection: false });
	var i;
	var j;
	var k;
	var l;
	var origin = [];
	var end = [];
	var isDragging = false;
	var drawingLine;

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
		var isDiagonal = Math.abs(origin[0]-end[0]) === Math.abs(origin[1]-end[1]);
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
		} else if(isDiagonal) {
			var xRight = origin[0] - end[0] < 0;
			var yDown = origin[1] - end[1] < 0;
			var i = 0;
			var loopTime = Math.abs(origin[0]-end[0]);
			for (;i<=loopTime;i++) {
				word += GRID[xRight ? origin[0] + i : origin[0] - i][yDown ? origin[1] +i : origin[1] - i];
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

	var validateGrid = function validateGrid() {
		var i = 1;
		var l = GRID.length;
		var supposed;
		if(l !== 0 && GRID[0]) {
			supposed = GRID[0].length;
			for(;i<l;i++) {
				if(GRID[i].length !== supposed){
					return false;
				}
			}
			return true;
		}
		return false;
	};

	// init grid
	var init = function init() {
		if(validateGrid()) {
			var numHeight = GRID.length;
			var numWidth = GRID[0].length;
			var ulContent = document.createDocumentFragment();
			var tmpLi;

			canvas.setDimensions({width: SIZE*numWidth + numWidth, height: SIZE*numHeight + numHeight});

			for (i = 0; i < numWidth; i++) {
				for (j = 0; j < numHeight; j++) {
					var rect = new LabeledRect({
						left: i * SIZE,
						top: j * SIZE,
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

			words.forEach(
				function(value, index){
					tmpLi = document.createElement('li');
					tmpLi.innerHTML = value.toUpperCase();
					ulContent.appendChild(tmpLi);
				}
			);

			document.getElementById('words').appendChild(ulContent);

		} else {
			throw new Error('invalid grid');
		}
	};


	canvas.on('mouse:down', function(options) {
		isDragging 	= true;
		var pointer = canvas.getPointer(options.e);
		var points 	= [ pointer.x, pointer.y, pointer.x, pointer.y ];
		origin = [Math.floor(points[1]/SIZE),Math.floor(points[0]/SIZE)];
		drawingLine = new fabric.Line(points, {
					stroke: 'black',
					strokeLineCap: 'round',
					strokeWidth: SIZE/6,
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
					strokeWidth: SIZE/6,
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
		// TODO calling callback
	};

	// let's call our game
	init();

})(fabric, SIZE, GRID, words);
