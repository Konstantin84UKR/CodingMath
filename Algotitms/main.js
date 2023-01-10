console.log("Hello")
let iterayion = 0;

function binarySearch(arr, item) {
    
    let min = 0;
    let max = arr.length - 1;
    let mid = -1;

    while (min < max) {
        iterayion++;
        mid = Math.ceil((max + min) / 2);
        let guess = arr[mid];

        if (item == guess){
            return mid; 
        }
        if (item > guess) {
            min = mid;
        } else if (item < guess) {
            max = mid;
        };
        
    }
    return -1;
}
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
    const result = binarySearch(arr, 21);
    console.log('result = ' + result);
    console.log('iterayion = ' + iterayion);
    
    