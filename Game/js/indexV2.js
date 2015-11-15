/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('load', app.onDeviceReady(), false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		
		Game.createGrid();
		
		$('.grid').click(function(e) {
			var elem = $(this);
            Game.findAvailableGrids( elem );
        });
    }
};

var Game = {
	startFrom : 1,
	current : 1,
	matrix : [
		[1,1,1,1,1],
		[1,1,1,1,1],
		[1,1,1,1,1],
		[1,1,1,1,1],
		[1,1,1,1,1]
	],
	totalAvailableGrid : function(){
		var row = Game.matrix.length;
		var col = Game.matrix[0].length;
		var indexer = 0;
		for(var i = 0; i < row; i++){
			for( var j = 0; j < col; j++ ){
				if( Game.matrix[i][j] === 1 ){
					indexer++;
				}
			}
		}
		return indexer;
	},
	gridWidth : Math.floor(280 / 5),
	gridHeight : Math.floor(280 / 5),
	createGrid : function(){
		var row = Game.matrix.length;
		var col = Game.matrix[0].length;
		var indexer = 0;
		for(var i = 0; i < row; i++){
			for( var j = 0; j < col; j++ ){
				if( Game.matrix[i][j] === 1 ){
					$('#gridHolder').append(
						$('<div />').attr({
							class : 'grid active'
						}).css({
							width : Game.gridWidth,
							height : Game.gridHeight,
							lineHeight : Game.gridHeight + 'px',
							fontSize : Game.gridHeight * 40 / 100
						}).bind('click',function(){
							Game.findAvailableGrids( $(this) );
						})
					);
				} else {
					$('#gridHolder').append(
						$('<div />').attr({
							class : 'grid passive'
						}).css({
							width : Game.gridWidth,
							height : Game.gridHeight
						})
					);
				}
			}
		}
	},
	findAvailableGrids : function(grid){
		if( grid.text() != '' ){
			return false; //This Grid Is Unavailable
		}
		$('.grid').removeClass('available');
		var index = grid.index();
		var row = Game.matrix.length;
		var col = Game.matrix[0].length;
		var indexer = 0;
		for(var i = 0; i < row; i++){
			for( var j = 0; j < col; j++ ){
				if( Game.matrix[i][j] == 1 && $('.grid').eq(indexer).text() == '' && Game.checkIfAvailable( $('.grid').eq(indexer), grid ) ){
					$('.grid').eq(indexer).addClass('available');
				}
				indexer++;
			}
		}
		Game.fillGrid(grid,Game.current);
	},
	getAvailableGrids : function(grid,writeable){
		/*if( grid.text() != ''){
			return false; //This Grid Is Unavailable
		}*/
		$('.grid').removeClass('available');
		//var index = grid.index();
		var row = Game.matrix.length;
		var col = Game.matrix[0].length;
		var indexer = 0;
		var temp = [];
		for(var i = 0; i < row; i++){
			for( var j = 0; j < col; j++ ){
				if( Game.matrix[i][j] == 1 && $('.grid').eq(indexer).text() == '' && Game.checkIfAvailable( $('.grid').eq(indexer), grid ) ){
					$('.grid').eq(indexer).addClass('available');
					temp.push( $('.grid').eq(indexer) );
				}
				indexer++;
			}
		}
		if(writeable){
			Game.fillGrid(grid,Game.current);
		}
		return temp;
	},
	fillGrid : function(grid, number){
		grid.text(number);
		/*if( number == Game.totalAvailableGrid()){
			alert('Çözüldü');
			return false;
		}*/
		Game.current++;
		Game.removeClick();
	},
	checkIfAvailable : function(checkedGrid, clickedGrid){
		var
			clickPT = clickedGrid.position().top,
			checkPT = checkedGrid.position().top,
			clickPL = clickedGrid.position().left,
			checkPL = checkedGrid.position().left,
			GW2 = Game.gridWidth * 2,
			GW3 = Game.gridWidth * 3;
		
		if(
			(clickPT + GW3 == checkPT && clickPL == checkPL) || // Only Bottom
			(clickPT + GW2 == checkPT && clickPL + GW2 == checkPL) || // Bottom Right
			(clickPT + GW2 == checkPT && clickPL - GW2 == checkPL) || // Bottom Left
			
			(clickPT - GW3 == checkPT && clickPL == checkPL) || // Only Top
			(clickPT - GW2 == checkPT && clickPL + GW2 == checkPL) || // Top Right
			(clickPT - GW2 == checkPT && clickPL - GW2 == checkPL) || // Top Left
			
			(clickPT == checkPT && clickPL - GW3 == checkPL) || // Only Left
			(clickPT == checkPT && clickPL + GW3 == checkPL) // Only Right
		){
			return true;
		}
		
		return false;
	},
	removeClick : function(){
		$('.grid').unbind('click');
		$('.grid.available').bind('click',function(){
			Game.findAvailableGrids( $(this) );
		});
	},
	clearGrid : function(){
		$('.grid').text('').empty();
	}
}

var stepMoveCount = [];

var availableSolutionCount = [];

var ii = 0;

function solve( gridObj ){
	if(typeof gridObj !== 'undefined'){
		var x = Game.getAvailableGrids(gridObj);
		stepMoveCount.push( x );
		$(gridObj).text(stepMoveCount.length);
		/*if( stepMoveCount.length == 25 ){
			console.log('Çözüldü');
			var str = '';
			for( var b = 0, n = $('.grid').size(); b < n; b++ ){
				str += $('.grid').eq(b).text() + ' ';
			}
			availableSolutionCount.push( str );
			return false;
		}
		*/
		solve( x[0] );
	} else {
		//solveReverse( stepMoveCount );
		solveRecursive( stepMoveCount );
	}
}

function solveRecursive(moveArray){

}

function solveReverse(moveArray){
	if( moveArray[moveArray.length-1].length == 0 ){
		$('.grid').filter(':contains(' + moveArray.length + ')').empty();
		moveArray.pop();
	}
	moveArray[moveArray.length-1].shift();
	solve( moveArray[moveArray.length-1][0] );
}

function checkHasAvailable( grid ){
	return Game.getAvailableGrids(grid,false).length > 0;
}