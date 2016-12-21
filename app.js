let gl,
    shaderProgram,
    vertices,
    vertexCount = 5000,
    mouseX = 0,
    mouseY = 0

canvas.addEventListener('mousemove', function (event) {
  mouseX = map(event.clientX, 0, canvas.width, -1, 1)
  mouseY = map(event.clientY, 0, canvas.height, 1, -1)
});

function map(value, minSrc, maxSrc, minDst, maxDst) {
  return (value - minSrc) / (maxSrc - minSrc) * (maxDst - minDst) + minDst
}

initGL()
createShader()
createVertices()
draw()

function initGL() {
  const canvas = document.getElementById('canvas')

  gl = canvas.getContext('webgl')

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1, 1, 1, 1);
}

function createShader() {
  let vertexShader = getShader(gl, "shader-vs")
  let fragmentShader = getShader(gl, "shader-fs")

  shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  gl.useProgram(shaderProgram)
}

function createVertices () {
  vertices = [];

  for(var i = 0; i < vertexCount; i++) {
    vertices.push(Math.random() * 2 - 1)
    vertices.push(Math.random() * 2 - 1)
  }

  var buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW)

  var coords = gl.getAttribLocation(shaderProgram, "coords")
  // gl.vertexAttrib3f(coords, 0, 0, 0)
  gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(coords)
  // gl.bindBuffer(gl.ARRAY_BUFFER, null)

  var pointSize = gl.getAttribLocation(shaderProgram, "pointSize")
  gl.vertexAttrib1f(pointSize, 10)

  var color = gl.getUniformLocation(shaderProgram, "color")
  gl.uniform4f(color, 0, 1, 0, 1)
}

function draw() {
  for(var i = 0; i < vertexCount * 2; i +=2) {
    const dx = vertices[i + 0] - mouseX;
    const dy = vertices[i + 1] - mouseY;

    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 0.2) {
      vertices[i + 0] = mouseX + dx / dist * 0.2
      vertices[i + 1] = mouseY + dy / dist * 0.2
    }

    vertices[i + 0] += Math.random() * 0.01 - 0.005;
    vertices[i + 1] += Math.random() * 0.01 - 0.005;
  }

  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices))
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, vertexCount)

  requestAnimationFrame(draw)
}
