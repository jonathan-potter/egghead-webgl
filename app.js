let gl,
    shaderProgram,
    vertices,
    matrix = mat4.create(),
    vertexCount

initGL()
createShader()
createVertices()
loadTexture()
draw()

function initGL() {
  const canvas = document.getElementById('canvas')

  gl = canvas.getContext('webgl')
  gl.enable(gl.DEPTH_TEST)
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
  vertices = [
    -1, -1,  0, 0,
     1, -1,  1, 0,
    -1,  1,  0, 1,
     1,  1,  1, 1
  ]
  vertexCount = vertices.length / 4

  var buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  var coords = gl.getAttribLocation(shaderProgram, "coords")
  gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 4, 0)
  gl.enableVertexAttribArray(coords)
  // gl.bindBuffer(gl.ARRAY_BUFFER, null)

  // var colorBuffer = gl.createBuffer()
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
  //
  var textureCoords = gl.getAttribLocation(shaderProgram, "textureCoords")
  gl.vertexAttribPointer(textureCoords, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 4, Float32Array.BYTES_PER_ELEMENT * 2)
  gl.enableVertexAttribArray(textureCoords)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  var pointSize = gl.getAttribLocation(shaderProgram, "pointSize")
  gl.vertexAttrib1f(pointSize, 10)

  // var color = gl.getUniformLocation(shaderProgram, "color")
  // gl.uniform4f(color, 0, 1, 0, 1)

  let perspectiveMatrix = mat4.create();
  mat4.perspective(perspectiveMatrix, 1, canvas.width / canvas.height, 0.1, 10)

  perspectiveLocation = gl.getUniformLocation(shaderProgram, "perspectiveMatrix");
  gl.uniformMatrix4fv(perspectiveLocation, false, perspectiveMatrix)

  mat4.translate(matrix, matrix, [0, 0, -4])
}

function loadTexture() {
  const image = document.createElement("img");
  image.crossOrigin = "";
  image.addEventListener("load", function () {
    const texture = gl.createTexture()
    const sampler = gl.getUniformLocation(shaderProgram, "sampler")

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
    gl.uniform1i(sampler, 0);
  })
  image.src = "other_thing.png"
}

function draw() {
  mat4.rotateZ(matrix, matrix, 0.01)
  mat4.rotateY(matrix, matrix, 0.02)
  mat4.rotateX(matrix, matrix, 0.03)

  const transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix")
  gl.uniformMatrix4fv(transformMatrix, false, matrix)

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount)
  // gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_BYTE, 0)

  requestAnimationFrame(draw)
}
