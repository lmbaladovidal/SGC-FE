const BASE_URL = 'http://192.168.1.55:5074';


export async function Login(user) {
    console.log(`${BASE_URL}/api/auth/login`);
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: user.username,
            password: user.password,
          }),
      });  

    if (!response.ok) {
      throw new Error("Fallo en la petición: " + response.status);
    }
    console.log("Respuesta:", response);
    const data = await response.json();
    console.log("Respuesta:", data);
    return data;
  }

  export async function UpdateTruckLocation(truck) {
    console.log("truck:", truck);
    const response = await fetch(`${BASE_URL}/api/Truck/SetLocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: truck.id,
            lat: truck.latitude,
            lng: truck.logitude,
          }),
      });  

    if (!response.ok) {
      throw new Error("Fallo en la petición: " + response.status);
    }
  
    console.log("Respuesta:", response);
    return response;
  }
  
  