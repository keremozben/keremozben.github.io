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
						}).attr({
							'data-x' : j,
							'data-y' : i
						}).bind('click',function(){
							Game.findAvailableGrids( [ $(this).data('y'), $(this).data('x') ] );
						})
					);
				} else {
					$('#gridHolder').append(
						$('<div />').attr({
							class : 'grid passive'
						}).css({
							width : Game.gridWidth,
							height : Game.gridHeight
						}).attr({
							'data-x' : j,
							'data-y' : i
						})
					);
				}
			}
		}
	},
	findAvailableGrids : function(grid){ // grid = [0,0]
		if( $('.grid[data-x="'+grid[1]+'"][data-y="'+grid[0]+'"]').text() != '' ){
			return false; //This Grid Is Unavailable
		}
		$('.grid').removeClass('available');
		
		if( grid[0] - 3 < 0 == false && $('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]-3)+'"]').text() == "" ){ //TOP
			$('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]-3)+'"]').addClass('available');
		}
		if( grid[1] + 3 > Game.matrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+3)+'"][data-y="'+grid[0]+'"]').text() == "" ){ //RIGHT
			$('.grid[data-x="'+(grid[1]+3)+'"][data-y="'+grid[0]+'"]').addClass('available');
		}
		if( grid[0] + 3 > Game.matrix.length-1 == false && $('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]+3)+'"]').text() == "" ){ //BOTTOM
			$('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]+3)+'"]').addClass('available');
		}
		if( grid[1] - 3 < 0 == false && $('.grid[data-x="'+(grid[1]-3)+'"][data-y="'+grid[0]+'"]').text() == "" ){ //LEFT
			$('.grid[data-x="'+(grid[1]-3)+'"][data-y="'+grid[0]+'"]').addClass('available');
		}
		if( grid[0] - 2 < 0 == false && grid[1] + 2 > Game.matrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]-2)+'"]').text() == "" ){ //TOP-RIGHT
			$('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]-2)+'"]').addClass('available');
		}
		if( grid[0] + 2 > Game.matrix.length-1 == false && grid[1] + 2 > Game.matrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]+2)+'"]').text() == "" ){ //BOTTOM-RIGHT
			$('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]+2)+'"]').addClass('available');
		}
		if( grid[0] + 2 > Game.matrix.length-1 == false && grid[1] - 2 < 0 == false && $('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]+2)+'"]').text() == "" ){ //BOTTOM-LEFT
			$('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]+2)+'"]').addClass('available');
		}
		if( grid[0] - 2 < 0 == false && grid[1] - 2 < 0 == false && $('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]-2)+'"]').text() == "" ){ //TOP-LEFT
			$('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]-2)+'"]').addClass('available');
		}
		
		Game.fillGrid(grid,Game.current);
	},
	getAvailableGrids : function(grid,writeable){
		
		$('.grid').removeClass('available');

		var temp = [];
		
		if( grid[0] - 3 < 0 == false && $('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]-3)+'"]').text() == "" ){ //TOP
			$('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]-3)+'"]').addClass('available');
			temp.push( [ (grid[0]-3), grid[1] ] );
		}
		if( grid[1] + 3 > Game.matrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+3)+'"][data-y="'+grid[0]+'"]').text() == "" ){ //RIGHT
			$('.grid[data-x="'+(grid[1]+3)+'"][data-y="'+grid[0]+'"]').addClass('available');
			temp.push( [ grid[0], (grid[1]+3) ] );
		}
		if( grid[0] + 3 > Game.matrix.length-1 == false && $('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]+3)+'"]').text() == "" ){ //BOTTOM
			$('.grid[data-x="'+grid[1]+'"][data-y="'+(grid[0]+3)+'"]').addClass('available');
			temp.push( [ (grid[0]+3), grid[1] ] );
		}
		if( grid[1] - 3 < 0 == false && $('.grid[data-x="'+(grid[1]-3)+'"][data-y="'+grid[0]+'"]').text() == "" ){ //LEFT
			$('.grid[data-x="'+(grid[1]-3)+'"][data-y="'+grid[0]+'"]').addClass('available');
			temp.push( [ grid[0], (grid[1]-3) ] );
		}
		if( grid[0] - 2 < 0 == false && grid[1] + 2 > Game.matrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]-2)+'"]').text() == "" ){ //TOP-RIGHT
			$('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]-2)+'"]').addClass('available');
			temp.push( [ (grid[0]-2), (grid[1]+2) ] );
		}
		if( grid[0] + 2 > Game.matrix.length-1 == false && grid[1] + 2 > Game.matrix[0].length-1 == false && $('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]+2)+'"]').text() == "" ){ //BOTTOM-RIGHT
			$('.grid[data-x="'+(grid[1]+2)+'"][data-y="'+(grid[0]+2)+'"]').addClass('available');
			temp.push( [ (grid[0]+2), (grid[1]+2) ] );
		}
		if( grid[0] + 2 > Game.matrix.length-1 == false && grid[1] - 2 < 0 == false && $('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]+2)+'"]').text() == "" ){ //BOTTOM-LEFT
			$('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]+2)+'"]').addClass('available');
			temp.push( [ (grid[0]+2), (grid[1]-2) ] );
		}
		if( grid[0] - 2 < 0 == false && grid[1] - 2 < 0 == false && $('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]-2)+'"]').text() == "" ){ //TOP-LEFT
			$('.grid[data-x="'+(grid[1]-2)+'"][data-y="'+(grid[0]-2)+'"]').addClass('available');
			temp.push( [ (grid[0]-2), (grid[1]-2) ] );
		}
		
		if(writeable){
			Game.fillGrid(grid,Game.current);
		}
		return temp;
	},
	fillGrid : function(grid, number){
		$('.grid[data-x="'+grid[1]+'"][data-y="'+grid[0]+'"]').text(number);
		Game.current++;
		Game.removeClick();
	},
	removeClick : function(){
		$('.grid').unbind('click');
		$('.grid.available').bind('click',function(){
			Game.findAvailableGrids( [ $(this).data('y'), $(this).data('x') ] );
		});
	},
	clearGrid : function(){
		$('.grid').text('').empty();
	}
}

var	stepMoveCount = [];

function solve( array ){
	var
		availableSolutionCount = [],
		x,
		grid,
		k,
		str,
		b,
		grids = $('.grid'),
		n = Game.totalAvailableGrid();
	do{
		if( array.length == 0 ){
			grid = [0,0];
			x = Game.getAvailableGrids( grid );
		} else {
			grid = false;
			for( k = array.length-1; k >= 0; k-- ){
				if( array[k].length == 0 ){
					grids.filter(':contains(' + array.length + ')').empty();
					array.pop();
					if(array.length > 0){
						array[array.length-1].shift();
					} else {
						break;
					}
				} else {
					break;
				}
			}
			if(array.length > 0){
				x = Game.getAvailableGrids( array[array.length-1][0] );
			} else {
				console.log('Bitti');
				return availableSolutionCount;
			}
		}
		array.push( x );
		if( !(array.length == 1 && array[0].length == 0) ){
			grid ? $('.grid[data-x="'+grid[1]+'"][data-y="'+grid[0]+'"]').text(array.length) : $('.grid[data-x="'+array[array.length-2][0][1]+'"][data-y="'+array[array.length-2][0][0]+'"]').text(array.length)
		}
		if( array.length == n ){
			console.log('Çözüldü');
			str = '';
			b = 0;
			for(; b < n; b++ ){
				str += grids.eq(b).text() + ' ';
			}
			availableSolutionCount.push( str );
			//return false;
		}
		
	} while (array.length > 0)
	return availableSolutionCount;
}