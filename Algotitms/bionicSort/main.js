
function do_flip(h,array) {
    let n = (array.length)/h;
   
    for (let i = 0; i < n; i++) {
        
        for (let j = 0; j < h/2; j++) {
            
            const idxA =  h * i + j;
            const idxB =  h * i + (h - 1 - j);

            let A = array[idxA];
            let B = array[idxB];
           
            if(A>B){
                array[idxA] = B; 
                array[idxB] = A; 
            } 
       }          
    }

}

function do_disperse(h,array) {
   
    let n = (array.length)/h;
    let hh = h/2;
   
    for (let i = 0; i < n; i++) {
        
        for (let j = 0; j < h/2; j++) {
            
            const idxA =  h * i + j;
            const idxB =  h * i + j + hh;

            let A = array[idxA];
            let B = array[idxB];
           
            if(A>B){
                array[idxA] = B; 
                array[idxB] = A; 
            }
       }          
    }
}

function bionicSort(arr) {
    let array = arr;
    let n = array.length; // n is our total number of sortable elements, must be power of 2

    for (let h = 2; h <= n; h *= 2) {
        do_flip(h,array);
        for (let hh = h/2; hh > 1; hh /= 2){
            do_disperse(hh,array);
        }        
    }

    return array;

}
   
    
    let arr = [];
    for (let i = 0; i < 64; i++) {
        arr.push(Math.floor(100 * Math.random())); // Генерация случайного числа от 0 до 1
    }
    console.log('arr = ' + arr);
    console.time('time');
    const result = bionicSort(arr);
    console.timeEnd('time');
    console.log('result = ' + result);

    
    
    
    