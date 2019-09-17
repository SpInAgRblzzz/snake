const board = document.querySelector('.board');//��������
const sideLength = 50;//������ ��������
//��������� �������
let innerStr = '';

//������������ ������
for(let i = 0; i <= sideLength; i++){
    innerStr += '<tr>';
    //������������ �����
    for(let j = 0; j <= sideLength; j++){
        innerStr += '<td class = "row-'+i+' column-' +j+'"><div class = "cell"></div></td>';
    }
    innerStr += '</tr>';
}

//������� ��������� � ��������
board.innerHTML = innerStr;

//���������� ���������� ��������� ������
let head = document.querySelector('.row-'+(sideLength/2)+'.column-'+(sideLength/2));
head.classList.add('head');

//��������� ���������� ��������� ������
let headCoordinates = [(sideLength/2),(sideLength/2)];

let tailLength = 1;
let tail = [];

let poopCoordinates = [];
let poopLength = 5;

//������� ��������
const directions = {
    Up:[-1,0],
    Right:[0,1],
    Down:[1,0],
    Left:[0,-1]
}

const headStyles = {
    Up: 'border-radius: 50% 50% 0 0',
    Right: 'border-radius: 0 50% 50% 0',
    Down: 'border-radius: 0 0 50% 50%',
    Left: 'border-radius: 50% 0 0 50%'
}
//������� �����������
let currentDirection = 'Up';
let chosenDirection = 'Up';

//���� �� �� ���� ������
let appleSpawned = false;
let appleCoordinates = [];
let apple;

//������� ��������
function moveHead(){
    //����� ������
    spawnApple();
        
    const directionRules = directions[chosenDirection];//��������� ���������� ������ �����������

    //����� ����������
    const newRow = headCoordinates[0] + directionRules[0];
    const newColumn = headCoordinates[1] + directionRules[1];

    const newHead = document.querySelector('.row-'+newRow+'.column-'+newColumn);//����� ������
    
    //�������� �� ��������� ��
    if(newHead === null || collisionCheck(tail,newRow, newColumn) || collisionCheck(poopCoordinates,newRow,newColumn)){
        clearInterval(movement);//��������� ��������
        alert('BOOOM');
        return;
    }

    //�������� ������
    tail.forEach(function(item){
        const tailSegment = document.querySelector('.row-'+item[0]+'.column-'+item[1]);
        tailSegment.classList.remove('tail');
    });
    tail.push(headCoordinates.slice());
    tail = tail.splice(-tailLength);
    tail.forEach(function(item){
        const tailSegment = document.querySelector('.row-'+item[0]+'.column-'+item[1]);
        tailSegment.classList.add('tail');
    });

    //�������� ����� ��  �� ������ � �������
    if(newRow === appleCoordinates[0] && newColumn === appleCoordinates[1]){
        appleSpawned = false;//������ �� ���� ������ ���
        apple.classList.remove('apple');//������ ������ � ����
        tailLength++;//��������� ������
    }

    //��������
    if((tailLength - 1) === poopLength){
        leavePoop();
        poopLength += 5;
    };

    head.querySelector('div').removeAttribute('style');

    headCoordinates = [newRow, newColumn]//���������� ��������� ������
    head.classList.remove('head');//�������� ������ ������ ������
    head = newHead;//������ ������
    head.querySelector('div').setAttribute('style', headStyles[chosenDirection]);
    head.classList.add('head');//���������� ������ �����

    currentDirection = chosenDirection;
};

//������ ��������
const movement = setInterval(moveHead,100);

//��������� ������ �����������
window.addEventListener('keydown',function(e){
    const key = e.key;
    if(currentDirection === 'Up' && key === 'ArrowDown'){
        chosenDirection = 'Up';
        return
    };
    if(currentDirection === 'Down' && key === 'ArrowUp'){
        chosenDirection = 'Down';
        return
    };
    if(currentDirection === 'Left' && key === 'ArrowRight'){
        chosenDirection = 'Left';
        return
    };
    if(currentDirection === 'Right' && key === 'ArrowLeft'){
        chosenDirection = 'Right';
        return
    };
    chosenDirection = key.substring(5);
    this.console.log(chosenDirection)
});

//������� ��������� ���������
function getRandom(min, max){
    return Math.floor(Math.random()*(max-min+1))+min;
};

function collisionCheck(arr,row, column){
    return arr.some(function(segment){
        return segment[0] === row && segment[1] === column;
    });
};

//������� �������� ����������� ��������� ������(����� �����������)
function checkAppleSpawn(row, column){
    const checkResult = (headCoordinates[0] === row && headCoordinates[1] === column) || collisionCheck(tail,row,column) || collisionCheck(poopCoordinates,row,column);
    return checkResult;
};

//������� ��������� ������
function spawnApple(){
    if(!appleSpawned){
        appleSpawned = true;
        let appleRow = getRandom(0,sideLength);
        let appleColumn = getRandom(0,sideLength);
        while(checkAppleSpawn(appleRow, appleColumn)){
            appleRow = getRandom(0,sideLength);
            appleColumn = getRandom(0,sideLength);
        };
        appleCoordinates = [appleRow, appleColumn];
        apple = document.querySelector('.row-'+appleRow+'.column-'+appleColumn);
        apple.classList.add('apple');
    };
};

//���������
function leavePoop(){
    const poopCoordinate = tail[0].slice();
    
    poopCoordinates.push(poopCoordinate);
    
    let poop = document.querySelector('.row-'+poopCoordinate[0]+'.column-'+poopCoordinate[1]);
    poop.classList.add('poop');
};