const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Класс кости
class Bone {
  constructor(x, y, length, angle,stiffness) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
    this.stiffness = stiffness;
    this.angularVelocity = 0;
  }
  
  // Метод для обновления угла кости с учетом физики
  update(angle) {
     const stiffnessForce = (this.angle - angle) * this.stiffness;
     this.angularVelocity -= stiffnessForce;
     this.angularVelocity *= 0.99; // Уменьшаем скорость вращения со временем (сопротивление воздуха)
     this.angle += this.angularVelocity;
   }

  // Метод для отрисовки кости
  draw(color) {
    ctx.strokeStyle = color; 
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    const endX = this.x + Math.cos(this.angle) * this.length;
    const endY = this.y + Math.sin(this.angle) * this.length;
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

// Создаем кости
const bone1 = new Bone(50, 50, 100, Math.PI / 4, 0.05); // Первая кость
const bone2 = new Bone(0, 0, 80, Math.PI / 4, 0.05); // Вторая кость, начинается из конца первой кости

// Функция для отрисовки и обновления костей
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Рассчитываем новый угол для костей
  //const angle1 = Math.sin(Date.now() * 0.002) * 0.5 + Math.PI / 4; // Простое волновое движение для первой кости
  //const angle2 = Math.sin(Date.now() * 0.002) * 0.5 + Math.PI / 4; // Простое волновое движение для второй кости
  const angle1 = Math.sin(Date.now() * 0.002)
  // Обновляем углы костей
  bone1.update(angle1);
  //bone2.update(angle2);

  // Отрисовываем кости
  bone1.draw('#5588ff');
  bone2.x = bone1.x + Math.cos(bone1.angle) * bone1.length;
  bone2.y = bone1.y + Math.sin(bone1.angle) * bone1.length;
  bone2.draw('#ff8855');

  // Повторяем отрисовку на следующем кадре
  requestAnimationFrame(draw);
}

// Запускаем анимацию
draw();