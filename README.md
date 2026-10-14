# Mi dinero

App personal de finanzas (gastos hormiga, presupuesto, deudas, MSI, ahorro, resumen). Corre 100% en el navegador; los datos se guardan en Firebase (Firestore) ligados a tu cuenta, así no dependen de un solo navegador/dispositivo.

## 1. Crear el proyecto de Firebase (una sola vez)

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y entra con tu cuenta de Google.
2. **Crear proyecto** → dale un nombre (ej. `mi-dinero`) → puedes desactivar Google Analytics, no hace falta.
3. En el menú lateral, **Build → Authentication → Get started**. En la pestaña "Sign-in method", habilita **Correo electrónico/contraseña**.
4. En el menú lateral, **Build → Firestore Database → Create database**. Elige la región más cercana (ej. `us-central`) y modo **producción**.
5. Ya dentro de Firestore, ve a la pestaña **Reglas** (Rules) y reemplaza todo el contenido por esto, luego **Publicar**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /usuarios/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

   Esto asegura que **solo tú**, ya con tu sesión iniciada, puedes leer o escribir tus propios datos — nadie más, aunque el código sea público.

6. En el menú lateral, ícono de engrane → **Configuración del proyecto**. Baja hasta "Tus apps" → ícono `</>` (Web) → dale un nombre → **Registrar app**. Te va a mostrar un bloque `firebaseConfig = {...}`.
7. Copia esos valores (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) y pégalos en [index.html](index.html), buscando el bloque cerca del inicio del `<script>` que dice `TU_API_KEY`, `TU_PROYECTO`, etc.

Estos valores del `firebaseConfig` **no son secretos** — están hechos para vivir en el código del navegador; la seguridad real la dan las Reglas del paso 5, no el que estén ocultos.

## 2. Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser público).
2. Sube este contenido (`index.html`, `README.md`) a ese repositorio.
3. En el repo → **Settings → Pages** → en "Build and deployment", fuente: **Deploy from a branch**, branch **main**, carpeta **/(root)** → **Save**.
4. En unos minutos tu app queda accesible en `https://<tu-usuario>.github.io/<nombre-repo>/`.

## 3. Usarla

La primera vez que abras la página en línea, crea tu cuenta (correo + contraseña) desde el mismo formulario. Esa misma cuenta la usas para entrar desde cualquier dispositivo y ver tus datos actualizados. Si ya tenías datos guardados localmente en un navegador, al crear tu cuenta ahí se migran automáticamente a la nube.
