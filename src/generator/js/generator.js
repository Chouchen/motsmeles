var grid = [];
var words= [];
var width = 1;
var height= 1;
var SIZE = 30;
var currentModeText = document.getElementById('currentMode');
var inputGrid;
var canvas;
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
var stepSection = document.getElementById('step');

var initGrid = function() {
    stepSection.innerHTML = '<div id="grid">'+
        '<aside id="generator-options">'+
        '<label for="grid-width"><input type="number" id="grid-width" min="1" max="20" step="1" name="grid-width" value="1"/></label>'+
        '<label for="grid-height"><input type="number" id="grid-height" min="1" max="20" step="1" name="grid-height" value="1"/></label>'+
        '</aside>'+
        '<section id="generator-grid"></section>'+
        '<button id="validateGrid">Validate</button>'+
        '</div>';
    currentModeText.innerHTML = 'Fill the grid with letters';
    inputGrid = document.getElementById('generator-grid');
    // grid
    var modifyGridSize = function modifyGridSize() {
        var currentWidth = width;//grid[0] ? grid[0].length : 0;
        var currentHeight = height;//grid.length;
        console.log('grid size is ' + currentWidth + ' x ' + currentHeight);
        var iHtml = '';
        for(var i = 0,l = currentHeight; i <l ; i++) {
            for (var j = 0, m = currentWidth; j<m; j++) {
                iHtml += '<input type="text" class="inputGrid" data-x="'+j+'" data-y="'+i+'" maxlength="1"/>';
            }
            iHtml += '<div class="clearboth"></div>';
        }
        inputGrid.innerHTML = iHtml;
        dynamicEvents();
    };
    document.getElementById('grid-width').addEventListener("change", function(evt){
        width = evt.currentTarget.value;
        modifyGridSize();
    }, false);
    document.getElementById('grid-height').addEventListener("change", function(evt){
        height = evt.currentTarget.value;
        modifyGridSize();
    }, false);
    var goToNextCase = function goToNextCase(sens) {
        var currentCase = document.activeElement;
        var currentX = currentCase.getAttribute('data-x');
        var currentY = currentCase.getAttribute('data-y');
        if (sens === 39) {
            if (currentX == width-1) {
                currentY++;
                currentX = -1;
            }
        }
        var nextCase;
        //        left = 37
        //        up = 38
        //        right = 39
        //        down = 40
        switch( sens ) {
            case 37:
                nextCase = document.querySelector('.inputGrid[data-x="'+(+currentX-1)+'"][data-y="'+currentY+'"]');
                break;
            case 38:
                nextCase = document.querySelector('.inputGrid[data-x="'+currentX+'"][data-y="'+(+currentY-1)+'"]');
                break;
            case 39:
                nextCase = document.querySelector('.inputGrid[data-x="'+(+currentX+1)+'"][data-y="'+currentY+'"]');
                break;
            case 40:
                nextCase = document.querySelector('.inputGrid[data-x="'+currentX+'"][data-y="'+(+currentY+1)+'"]');
                break;
            default: nextCase = currentCase;
                break;
        }
        if(nextCase !== undefined) {
            nextCase.focus();
        }
    };
    var gridKeyup = function gridKeyup(evt) {
        var typedKey = evt.keyCode;
        var senses = [37,38,39,40];
        if (senses.indexOf(typedKey) !== -1) {
            goToNextCase(typedKey);
        } else if (typedKey >= 65 && typedKey <= 90) {
            evt.currentTarget.value = String.fromCharCode(typedKey).toUpperCase();
            goToNextCase(39);
        }
    };
    var dynamicEvents = function dynamicEvents() {
        var inputs = document.getElementsByClassName('inputGrid');
        var inputsLength = inputs.length;
        for (var i = 0; i < inputsLength; i++) {
            var input = inputs[i];
            input.removeEventListener("keyup",gridKeyup);
            input.addEventListener("keyup", gridKeyup.bind(this), false);
        }
    };
    var isGridValid = function isGridValid() {
        for (var i = 0,l = height; i <l ; i++) {
            for (var j = 0, m = width; j<m; j++) {
                if (document.querySelector('.inputGrid[data-x="'+j+'"][data-y="'+i+'"]').value === '') {
                    return false;
                }
            }
        }
        return true;
    };
    document.getElementById('validateGrid').addEventListener('click', function(e) {
        if (isGridValid()) {
            for (var i = 0,l = height; i <l ; i++) {
                grid[i] = [];
                for (var j = 0, m = width; j<m; j++) {
                    grid[i][j] = document.querySelector('.inputGrid[data-x="'+j+'"][data-y="'+i+'"]').value;
                }
            }
            console.log(grid);
            location.href = '#wordsList';
            initWords();
            // gotonextstep
        }
    }, false);
};
var initWords = function initWords() {
    stepSection.innerHTML = '<div id="wordsList">'+
        '<canvas id="c"></canvas>'+
        '<ul id="words"></ul>'+
        '<button id="validateWord">Validate</button>'+
        '</div>';
    currentModeText.innerHTML = 'Cross all your words';
    canvas = new fabric.Canvas('c', { selection: false });
    var numHeight = grid.length;
    var numWidth = grid[0].length;
    var ulContent = document.createDocumentFragment();
    var tmpLi;
    var i, isDragging, origin, drawingLine, end;

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
                label: grid[j][i],
                selectable: false
            });
            canvas.add(rect);
        }
    }
    canvas.on('mouse:down', function(options) {
        isDragging 	= true;
        var pointer = canvas.getPointer(options.e);
        var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
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
            var newWord = addWord();
            var newLi = document.createElement('li');
            newLi.innerHTML = newWord;
            document.getElementById('words').appendChild(newLi);
            words.push(newWord);
            var lineCoord = origin.reverse().join('').concat(end.reverse().join('')).split('');
            lineCoord = lineCoord.map(function(map){return map*SIZE+SIZE/2;});
            var line = new fabric.Line(lineCoord, {
                stroke: 'black',
                strokeLineCap: 'round',
                strokeWidth: SIZE/6,
                originX: 'center',
                originY: 'center',
                selectable: false
            });
            canvas.add(line);
        }
        origin = [];
        end = [];
    });

    var addWord = function addWord() {
        var result = -1;
        var isHorizontal = origin[0] === end[0];
        var isVertical = origin[1] === end[1];
        var isDiagonal = Math.abs(origin[0]-end[0]) === Math.abs(origin[1]-end[1]);
        var x;
        var toGo = [];
        var word = '';
        var range = function range(origin, end) {
            var matrix = [];
            var plus;
            plus = origin <= end;
            if (plus) {
                while (origin <= end) {
                    matrix.push(origin);
                    origin ++;
                }
            } else {
                while (origin >= end) {
                    matrix.push(origin);
                    origin --;
                }
            }
            return matrix;
        };

        if(isHorizontal) {
            range(origin[1], end[1]).forEach(function(elt) {
                word += grid[origin[0]][elt];
            });
        }else if (isVertical) {
            range(origin[0], end[0]).forEach(function(elt) {
                word += grid[elt][origin[1]];
            });
        } else if(isDiagonal) {
            var xRight = origin[0] - end[0] < 0;
            var yDown = origin[1] - end[1] < 0;
            var i = 0;
            var loopTime = Math.abs(origin[0]-end[0]);
            for (;i<=loopTime;i++) {
                word += grid[xRight ? origin[0] + i : origin[0] - i][yDown ? origin[1] +i : origin[1] - i];
            }
        }
        return word;
    };

    document.getElementById('validateWord').addEventListener('click', function(evt) {
        location.href = '#validate';
        initSave();
    }, false);
};
var initSave = function initSave() {
    currentModeText.innerHTML = 'Copy this in your game and that\'s it. :)';
    stepSection.innerHTML = '<div id="validate">'+
        '<textarea></textarea>'+
        '</div>';
    // save
    var arrayToString = function arrayToString(array) {
        var result = '[';
        array.forEach(function(elt){
            if (typeof elt === "object") {
                result += arrayToString(elt) + ',';
            } else {
                result += "'" +  ""+elt + "',";
            }
        });
        result = result.slice(0, -1) + ']';
        return result;
    };
    document.querySelector('textarea').innerHTML = 'var GRID = ' + arrayToString(grid) + '; var words = ' + arrayToString(words) + ';';
};


initGrid();