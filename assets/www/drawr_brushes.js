function DrawrBrushes(onload_continuation){
    this.brushes = [];
    //this.brush_names = ["circle1", "circle4","circle8","circle16","circle32","bar8"];
	this.brush_names = ["circle","critters","cat","cat32","kappa","custom"]; //"dota"];
    this.brush_types = ["brush","stamp","stamp","stamp","stamp"]; //"stamp"];
	this.brush_variations = [10, 7, 5, 1, 1, 0]; //102];
	this.brush_sizes = [32, 16, 16, 32, 32, 16]; //32];
	
	this.selected_brush = 0;
    this.brush_size = 1;
	this.size_variations = [1, 4, 8, 16, 32];
    this.loaded_count = 0;
    
	//load brushes and stamps
	for(var i=0; i<this.brush_names.length; ++i){
		name = this.brush_names[i];
		for (var j = 0; j<this.brush_variations[i]; ++j){
			var type = this.brush_types[i];
			if (type == "brush"){
				var sized_images = [];
				var brush_obj = {
					img: null,
					name: name + j,
					size: 0,
					sized_images: [],
					type: type,
					loaded: 1 - this.size_variations.length
				}
				for (var k = 0; k<this.size_variations.length;++k){
					var temp_img = new Image();
					var size = this.size_variations[k];
					temp_img.src = "brushes/"+name+"/"+j+"/"+size+".png"; //brushes/circle/0/16.png
					sized_images.push(temp_img);
					
					var self_ref = this;
					temp_img.onload = function(){
						brush_obj.loaded += 1;
						if (brush_obj.loaded == 1)
							self_ref.loaded_count++;
						if (self_ref.loaded_count == self_ref.brush_names.length){
							onload_continuation();
						}
					}
				}
				brush_obj.sized_images = sized_images;
				this.brushes.push(brush_obj);
			}
			else if (type == "stamp"){
				var temp_img = new Image();
				temp_img.src = "brushes/" + name + "/" + j + ".png";
				var brush_name = name + j;
				
				var brush_obj = {
					img: temp_img, 
					name: brush_name, 
					size: this.brush_sizes[i],
					sized_images: null,
					type: type, 
					loaded: 0
				};
				
				var self_ref = this;
				temp_img.onload = function(){
					brush_obj.loaded = 1;
					self_ref.loaded_count++;
					
					if(self_ref.loaded_count == self_ref.brush_names.length){
						onload_continuation();
					}
				}
				this.brushes.push(brush_obj);
			}
		}
	}
}

DrawrBrushes.prototype.getBrushes = function(){
    return this.brushes;
}

DrawrBrushes.prototype.getBrushNames = function(){
	return this.brush_names;
}

DrawrBrushes.prototype.selectBrush = function(brush){
    if(brush + '' == (1*brush) + ''){ // if brush by number
        this.selected_brush = 1*brush;
    }else{
        for(var i=0; i<this.brushes.length; ++i){
            if(this.brushes[i].name == brush){
                this.selected_brush = i;
                return this.selected_brush;
            }
        }
        this.selected_brush = 0;
        return this.selected_brush;
    }
}

DrawrBrushes.prototype.getBrush = function(){
    return this.brushes[this.selected_brush];
}

DrawrBrushes.prototype.getBrushSize = function(){
	return this.brush_size;
}

DrawrBrushes.prototype.setBrushSize = function(size){
	this.brush_size = size;
}

DrawrBrushes.draw = function(ctx, x, y, brush, size){
	var s = Math.floor(size/2);
	if (brush.type == "brush"){
		index = 0;
		if (size == 4) 			index = 1;
		else if (size == 8) 	index = 2;
		else if (size == 16) 	index = 3;
		else if (size == 32) 	index = 4;
		
		var brush_img = brush.sized_images[index];
		ctx.drawImage(brush_img, x-s, y-s);
	}else if (brush.type == "stamp"){
		var brush_img = brush.img;
		
		ctx.drawImage(brush_img, x-s, y-s, size, size);
	}
}