# Plantilla del embudo «precio primero» · el grafo

Es el `grafo` que se pasa a `chat_flujo_guardar`. Antes de usarlo, lee [flujo-plantilla.md](flujo-plantilla.md): explica qué hace cada nodo, qué va en cada marcador `[[…]]` y cómo se guarda. Reemplaza TODOS los marcadores (ninguno puede quedar en el grafo guardado) y no toques ids, tipos ni conexiones salvo lo que diga «Opcional».

Todas las posiciones van en `{"x": 0, "y": 0}`: al guardar, la app ordena el diagrama sola.

```json
{
 "nodes": [
  {
   "id": "n_entrada",
   "type": "condicion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "ramas": [
     {
      "id": "r_sin_bienvenida",
      "nombre": "Responde a una plantilla o ya conversó (ve la imagen y contesta el agente)",
      "reglas": [
       {
        "op": "is_set",
        "campo": "plantilla_respondida"
       },
       {
        "op": "eq",
        "campo": "es_primer_mensaje",
        "valor": "no"
       }
      ],
      "combinar": "or"
     },
     {
      "id": "r_precio",
      "nombre": "Pregunta el precio («presio», «cuánto», «bale»)",
      "reglas": [
       {
        "op": "contains",
        "campo": "primer_mensaje",
        "valor": "precio"
       },
       {
        "op": "contains",
        "campo": "primer_mensaje",
        "valor": "presio"
       },
       {
        "op": "contains",
        "campo": "primer_mensaje",
        "valor": "cuanto"
       },
       {
        "op": "contains",
        "campo": "primer_mensaje",
        "valor": "cuesta"
       },
       {
        "op": "contains",
        "campo": "primer_mensaje",
        "valor": "costo"
       },
       {
        "op": "contains",
        "campo": "primer_mensaje",
        "valor": "vale"
       },
       {
        "op": "contains",
        "campo": "primer_mensaje",
        "valor": "bale"
       }
      ],
      "combinar": "or"
     },
     {
      "id": "r_pregunta",
      "nombre": "Escribió su propia pregunta (no de precio)",
      "reglas": [
       {
        "op": "eq",
        "campo": "pregunta_propia",
        "valor": "si"
       }
      ],
      "combinar": "or"
     }
    ]
   }
  },
  {
   "id": "m_bienvenida",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "image",
      "url": "[[URL_IMAGEN_PROMO]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "media",
      "media": "image",
      "url": "[[URL_FOTO_EN_MANO]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "media",
      "media": "audio",
      "url": "[[URL_AUDIO_A1]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "texto",
      "texto": "[[FRASE_PRODUCTO]]\n[[LINEA_ENVIO]]\n¿Cuál promoción le envío? 👇",
      "botones": [
       {
        "id": "b1",
        "titulo": "[[BOTON_1]]"
       },
       {
        "id": "b2",
        "titulo": "[[BOTON_2]]"
       },
       {
        "id": "b3",
        "titulo": "[[BOTON_3]]"
       }
      ]
     }
    ],
    "cierre": {
     "tipo": "ninguno",
     "timeout_min": 4
    }
   }
  },
  {
   "id": "m_bienvenida_pp",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "image",
      "url": "[[URL_IMAGEN_PROMO]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "media",
      "media": "image",
      "url": "[[URL_FOTO_EN_MANO]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "texto",
      "texto": "[[FRASE_PRODUCTO]]\n[[LINEA_ENVIO]]"
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "s_4min",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "texto",
      "texto": "¿Pudo ver la promoción? 👆",
      "botones": [
       {
        "id": "b1",
        "titulo": "[[BOTON_1]]"
       },
       {
        "id": "b2",
        "titulo": "[[BOTON_2]]"
       },
       {
        "id": "b3",
        "titulo": "[[BOTON_3]]"
       }
      ]
     }
    ],
    "cierre": {
     "tipo": "ninguno",
     "timeout_min": 56
    }
   }
  },
  {
   "id": "s_1h",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "audio",
      "url": "[[URL_AUDIO_A9]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "texto",
      "texto": "¿Cuál promoción le envío? 👇",
      "botones": [
       {
        "id": "b1",
        "titulo": "[[BOTON_1]]"
       },
       {
        "id": "b2",
        "titulo": "[[BOTON_2]]"
       },
       {
        "id": "b3",
        "titulo": "[[BOTON_3]]"
       }
      ]
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "m_vuelta_promo",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "texto",
      "texto": "¿Cuál promoción le envío? 👇",
      "botones": [
       {
        "id": "b1",
        "titulo": "[[BOTON_1]]"
       },
       {
        "id": "b2",
        "titulo": "[[BOTON_2]]"
       },
       {
        "id": "b3",
        "titulo": "[[BOTON_3]]"
       }
      ]
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "x_c1",
   "type": "accion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "acciones": [
     {
      "tipo": "guardar",
      "valor": "1",
      "variable": "cantidad"
     },
     {
      "tipo": "pedido",
      "accion": "forma_pago",
      "metodo": "cod"
     }
    ]
   }
  },
  {
   "id": "x_c2",
   "type": "accion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "acciones": [
     {
      "tipo": "guardar",
      "valor": "2",
      "variable": "cantidad"
     },
     {
      "tipo": "pedido",
      "accion": "forma_pago",
      "metodo": "cod"
     }
    ]
   }
  },
  {
   "id": "x_c3",
   "type": "accion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "acciones": [
     {
      "tipo": "guardar",
      "valor": "3",
      "variable": "cantidad"
     },
     {
      "tipo": "pedido",
      "accion": "forma_pago",
      "metodo": "cod"
     }
    ]
   }
  },
  {
   "id": "x_c1b",
   "type": "accion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "acciones": [
     {
      "tipo": "guardar",
      "valor": "1",
      "variable": "cantidad"
     },
     {
      "tipo": "pedido",
      "accion": "forma_pago",
      "metodo": "cod"
     }
    ]
   }
  },
  {
   "id": "x_compra",
   "type": "accion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "acciones": [
     {
      "tipo": "pedido",
      "accion": "forma_pago",
      "metodo": "cod"
     }
    ]
   }
  },
  {
   "id": "m_datos",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "audio",
      "url": "[[URL_AUDIO_A2]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "texto",
      "texto": "Solo necesito 3 cosas 👇\n1. Nombre\n2. Teléfono\n3. Dirección (y una referencia, si puede)\n¿Me los manda? Puede ser en audio 🎤"
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "w_datos",
   "type": "esperar",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "duracion",
    "minutos": 10,
    "cancelable": true
   }
  },
  {
   "id": "s_10min",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "texto",
      "texto": "Ya tengo su pedido apartado 🙌 Solo me falta su dirección para mandárselo. Puede mandarla en audio o escrita."
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "m_vuelta_datos",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "texto",
      "texto": "¿Me completa sus datos para mandárselo? Puede ser en audio 🎤"
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "p_a3",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "audio",
      "url": "[[URL_AUDIO_A3]]",
      "caption": ""
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "p_a4",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "image",
      "url": "[[URL_FOTO_EN_MANO]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "media",
      "media": "audio",
      "url": "[[URL_AUDIO_A4]]",
      "caption": ""
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "p_a5",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "audio",
      "url": "[[URL_AUDIO_A5]]",
      "caption": ""
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "p_a6",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "audio",
      "url": "[[URL_AUDIO_A6]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "texto",
      "texto": "¿Para qué día se lo aparto? 📅"
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "p_a7",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "audio",
      "url": "[[URL_AUDIO_A7]]",
      "caption": ""
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "c_a7",
   "type": "condicion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "ramas": [
     {
      "id": "r_dias",
      "nombre": "El agente ya sabe la ciudad y los días",
      "reglas": [
       {
        "op": "is_set",
        "campo": "dias_ciudad"
       },
       {
        "op": "is_set",
        "campo": "ciudad_cliente"
       }
      ],
      "combinar": "and"
     }
    ]
   }
  },
  {
   "id": "p_a7_dias",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "texto",
      "texto": "🚚 A {{ciudad_cliente}} le llega en {{dias_ciudad}}."
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "p_a7_ciudad",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "texto",
      "texto": "🚚 Tarda [[PLAZO_ENTREGA]], según la ciudad. ¿De qué ciudad me escribe, para decirle cuánto tarda a la suya? 📍"
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "p_a8",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "audio",
      "url": "[[URL_AUDIO_A8]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "texto",
      "texto": "🚚 [[ENVIO]] y paga al recibir. ¿Me manda sus datos? Puede ser en audio 🎤"
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "p_foto",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "video",
      "url": "[[URL_VIDEO_DEMO]]",
      "caption": ""
     },
     {
      "tipo": "media",
      "media": "image",
      "url": "[[URL_FOTO_EN_MANO]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "texto",
      "texto": "Así le llega 👆"
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "p_regalo",
   "type": "mensaje",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "modo": "sesion",
    "bloques": [
     {
      "tipo": "media",
      "media": "image",
      "url": "[[URL_IMAGEN_REGALO]]",
      "caption": ""
     },
     {
      "tipo": "pausa",
      "segundos": 1
     },
     {
      "tipo": "texto",
      "texto": "🎁 [[TEXTO_REGALO]]"
     }
    ],
    "cierre": {
     "tipo": "ninguno"
    }
   }
  },
  {
   "id": "c_fase",
   "type": "condicion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "ramas": [
     {
      "id": "r_eligio",
      "nombre": "Ya eligió cuántas unidades",
      "reglas": [
       {
        "op": "is_set",
        "campo": "cantidad"
       }
      ],
      "combinar": "and"
     }
    ]
   }
  },
  {
   "id": "c_ag",
   "type": "condicion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "ramas": [
     {
      "id": "r_eligio",
      "nombre": "Ya eligió cuántas unidades",
      "reglas": [
       {
        "op": "is_set",
        "campo": "cantidad"
       }
      ],
      "combinar": "and"
     }
    ]
   }
  },
  {
   "id": "n_avisar",
   "type": "accion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "acciones": [
     {
      "tipo": "notificar",
      "canal": "whatsapp",
      "mensaje": "[[NOMBRE_CORTO]]: un cliente manda audios o no sabe leer, y ningún audio grabado contesta lo que pregunta. Entra al chat a responderle por audio."
     }
    ]
   }
  },
  {
   "id": "n_aviso_reserva",
   "type": "accion",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "acciones": [
     {
      "tipo": "notificar",
      "canal": "whatsapp",
      "mensaje": "Reserva nueva · [[NOMBRE_PRODUCTO]]\nPara: {{fecha_reserva}}\nCliente: {{nombre}} · {{ciudad}}\nDirección: {{direccion}}\nPaquete: {{paquete}}\nEl pedido NO está registrado. Dos días antes de la fecha: escríbele para confirmar y, si confirma, registra el pedido con la nota «Entregar el <día y fecha>»."
     }
    ]
   }
  },
  {
   "id": "n_agente",
   "type": "ceder_ia",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "objetivo": "Resolver la duda que tenga sobre [[NOMBRE_PRODUCTO]] —con el audio grabado solo si contesta justo lo que preguntó; si no, texto corto— y llevarlo a elegir 1, 2 o 3 [[UNIDADES]] con los botones, o a apartarlo para su fecha si hoy no tiene dinero. De usted, 1 o 2 líneas y una sola pregunta.",
    "contexto": "*TRATO — MANDA SOBRE TODO:* siempre de usted («le», «su», «usted»), aunque el cliente tutee; nunca tú ni vos. «Don» y «doña» solo van junto al nombre del cliente («don Carlos», «doña María»). Si no sabe su nombre, NO use ningún tratamiento: ni «don», ni «doña», ni «amigo», «caballero», «joven», «señor», «jefe» ni «estimado», y menos al cerrar una frase («…, don.», «Listo, don, …»). Hable directo, sin llamarlo de ninguna manera.\n*OTROS PRODUCTOS:* si pregunta si tenemos otros productos o pide uno distinto, llame ver_otros_productos y conteste lo que pidió, sin precios de esos productos; si nada se parece a lo que pide, avisar_producto_buscado. Sin desviarse: después vuelva a las promociones de [[NOMBRE_CORTO]] (1, 2 o 3 [[UNIDADES]]). Si prefiere seguir con este producto, no vuelva a mencionar los otros. Texto justo y genuino, como una persona del equipo de {{nombre_marca}} en [[PAIS]]: a veces una línea, a veces dos, nunca más; una sola pregunta. La gente casi no lee. Moneda: [[MONEDA]]. El producto: «[[NOMBRE_PRODUCTO]]» la primera vez; después «[[NOMBRE_CORTO]]». *LO QUE HACE — IMPORTANTE:* el cliente lo compra para [[RESULTADO_QUE_BUSCA]] y eso es lo que hace: dígalo claro y con seguridad. [[COMO_SE_NOTA_EL_RESULTADO]] Lo único que no se promete es [[LO_QUE_NO_SE_PROMETE]]: eso depende de cada persona. Nunca le reste valor («no es magia», «no hace milagros», «solo ayuda un poco»).\n*IMPORTANTE — NO CORRIJA AL CLIENTE:* si llama al producto con otra palabra, use la suya; nunca le diga cómo se llama «de verdad». Tampoco corrija sus cuentas ni sus redondeos.\n\nLO QUE YA VIO: al entrar le llegó la imagen con las 3 promociones y, casi siempre, el audio de bienvenida y los 3 botones. No le repita la lista de precios como si fuera nueva.\n\nOFERTA: 1 [[UNIDAD]] {{precio_1x}} · 2 [[UNIDADES]] {{precio_2x}} (la más pedida) · 3 [[UNIDADES]] {{precio_3x}}. [[ENVIO]]. Contra entrega por defecto: paga en efectivo al recibir; no le pregunte cómo va a pagar. Transferencia con {{descuento_transferencia_pct}} % de descuento SOLO si la pide ({{precio_transferencia_1x}}, {{precio_transferencia_2x}} o {{precio_transferencia_3x}}). [[OTRAS_FORMAS_PAGO]]. [[REGALO]]\n*IMPORTANTE — SOLO 1:* si elige 1 o dice «solo uno», se le vende 1: no le vuelva a ofrecer el de 2 ni le hable de ahorro.\n\n*AUDIOS GRABADOS:* salga por una pieza SOLO si su audio contesta justo lo que el cliente pregunta en ese momento (lea la descripción de cada salida). Si no encaja exacto, o esa pieza ya salió, conteste usted en texto corto. Ejemplo: pregunta el precio → pieza precio, nunca funciona_uso. *IMPORTANTE — AL SALIR POR UNA PIEZA:* su texto en ese turno es SOLO «Mire 👇», nada más: la pieza ya contesta. Nunca escriba la respuesta además del audio, ni «cuando tenga el dinero me escribe». Ejemplos: cliente dice «es original?» → usted escribe «Mire 👇» y sale por original; cliente dice «yoles escribo cuando tenga el dinero» → «Mire 👇» y sale por apartar.\n*IMPORTANTE — AUDIO:* si manda notas de voz, dice que no sabe leer o pide que le hablen por audio, conteste con la pieza que corresponda a lo que preguntó. Nunca diga «no puedo mandar audios» ni «por aquí no». Si ninguna pieza contesta lo que pregunta, respóndale en una línea simple y salga por avisar_dueno.\nENTREGA: si ya sabe su ciudad, antes de salir por entrega use consultar_cobertura y pase ciudad_cliente y dias_ciudad (ej. «2 a 3 días hábiles»). Si en su municipio solo hay punto de encuentro, no salga por entrega: explíquelo usted en texto.\n\nCÓMO CIERRA: 1. Conteste lo que preguntó (si escribió su propia pregunta al entrar, esa primero). 2. Si contestó en texto y todavía no elige, salga por ver_promos para que le lleguen los botones; si los botones le llegaron en su turno anterior, termine con «¿Cuál le preparo?». 3. Si dice cuántos quiere (texto o audio), salga por compra con la cantidad. Si dice que sí pero no cuántos, ver_promos.\n*IMPORTANTE:* una «k», «ok» o 👍 no es un sí: salga por ver_promos.\n*IMPORTANTE — TRANSCRIPCIÓN RARA:* si la nota de voz se entiende rara (otro producto, otra ciudad, algo que no encaja), no adivine: pregunte en una línea qué quiso decir.\nDATOS DE UNA VEZ: si manda nombre y dirección (con la ciudad; la referencia solo si no se entiende dónde queda) y ya se sabe cuántos, llame registrar_pedido en ese turno (evento datos_completos, cantidad, precio_total de esa cantidad, metodo_pago 'cod' salvo que pida transferencia, y datos_envio con nombre, telefono —el de este WhatsApp si no da otro—, departamento y ciudad sacados de la dirección, y direccion: solo la dirección y la referencia si la dio, sin comentarios; lo que pida el cliente va en nota). Si no dijo cuántos, pregúnteselo antes en una línea.\nUNA PREGUNTA: en cada mensaje una sola pregunta. No ofrezca ningún otro producto ni adicional: solo el paquete que eligió (el flujo ya le pide los datos justo después).\nNOTAS DEL CLIENTE: lo que pida aparte (que lo llamen antes, a qué hora, dónde dejarlo) va en el campo nota de registrar_pedido; en direccion va solo la dirección. Nunca prometa una llamada ni una hora: diga «Quedó anotada su petición».\nAUDIO DEL CLIENTE: si escribe por audio y una pieza contesta su duda (precio, entrega, original), prefiera la pieza al texto.\nSIN DINERO HOY: nunca se lo mande igual ni le insista en pedirlo: salga por apartar.\nNUNCA: «¿confirma que todo está correcto?» (la confirmación la manda el sistema); prometer que puede revisar el paquete antes de pagar; ofrecer cancelar; «réplica», «imitación» o «no es original»; inventar testimonios; precios de otro producto. Una persona solo si está muy enojado.\nETIQUETAS: update_crm solo con 'Alta intención de compra', 'Comprará después' o '#reserva'.\nDATOS DEL PRODUCTO: los de la ficha, con seguridad (nunca «no tengo información»). ¿Es original? Sí: [[RESPUESTA_ORIGINAL]]. Uso: [[MODO_DE_USO]].",
    "intents_salida": [
     {
      "id": "funciona_uso",
      "descripcion": "Pieza: audio que explica cómo funciona y cómo se usa, y termina preguntando cuál le prepara. Por SENTIDO: quiere saber si de verdad sirve, en cuánto tiempo se nota, cómo o dónde se usa, o cuánto le dura. Ej.: «¿funciona?», «de verdad sirve?», «como se aplica», «como se usa», «cuanto dura», «sirbe?». Si pregunta otra cosa (precio, envío), no es esta. Una vez por conversación; después, texto corto."
     },
     {
      "id": "original",
      "descripcion": "Pieza: foto real del producto + audio. Por SENTIDO: duda de que sea auténtico o igual al del anuncio. Ej.: «¿es original?», «no es imitación, ¿verdad?», «¿es el mismo del video?», «¿es pirata?», «es orijinal?», «no será réplica?». Una vez por conversación; después, texto corto."
     },
     {
      "id": "precio",
      "descripcion": "Pieza: audio con los precios de las 3 promociones, que pregunta si se lo prepara. Por SENTIDO: vuelve a preguntar cuánto cuesta, no entendió los precios o los pide en audio. Ej.: «presio?», «cuanto bale», «y cuánto es el de 2», «dígame los precios en audio», «no entiendo los números». Una vez por conversación; después, texto corto."
     },
     {
      "id": "apartar",
      "descripcion": "Pieza: audio que ofrece apartárselo para el día que diga. Por SENTIDO: hoy no tiene el dinero o lo quiere para más adelante. Ej.: «no tengo dinero ahorita», «hasta la quincena», «cuando me paguen le escribo», «okey yoles escribo para el dia keya tenga el dinero», «para el otro viernes». Solo la primera vez."
     },
     {
      "id": "reservar",
      "descripcion": "Ya escuchó el audio de apartar y sigue con dejarlo para otra fecha: pasa directo a apartarlo, sin audio."
     },
     {
      "id": "entrega",
      "descripcion": "Pieza: audio sobre la entrega (a su casa o trabajo, paga al recibir). Por SENTIDO: cómo o cuándo le llega, si tiene que ir a una oficina, si se lo dejan en el trabajo. Ej.: «cuando yega?», «tengo que ir a traerlo?», «me lo dejan en mi trabajo?», «como es la entrega», «llega a mi casa?». Si ya sabe su ciudad, pase variables_capturadas ciudad_cliente y dias_ciudad (de consultar_cobertura). No salga si en su municipio solo hay punto de encuentro. Una vez por conversación."
     },
     {
      "id": "uno_o_caro",
      "descripcion": "Pieza: audio para quien quiere solo uno o siente caro el precio (le ofrece el de 1 y le pide los datos). Por SENTIDO: «solo quiero uno», «nomas uno», «está caro», «no hay rebaja?», «más barato?», «solo me alcanza para uno». Una vez por conversación."
     },
     {
      "id": "ver_producto",
      "descripcion": "Pieza: video demo y foto real del producto. Por SENTIDO: quiere ver cómo es. Ej.: «como es?», «mándeme foto», «quiero verlo», «tiene video?». Una vez por conversación."
     },
     {
      "id": "regalo",
      "descripcion": "Pieza: imagen del regalo. Por SENTIDO: pregunta qué trae de regalo o qué es el regalo. Ej.: «que trae de regalo?», «y el regalo qué es?». Una vez por conversación."
     },
     {
      "id": "ver_promos",
      "descripcion": "Le llegan los 3 botones de promoción (1, 2 o 3 [[UNIDADES]]). Por SENTIDO: dice que sí o que lo quiere sin decir cuántos («si», «lo quiero», «k», «ok», 👍), o ya le contestó en texto y todavía no elige."
     },
     {
      "id": "compra",
      "descripcion": "Por SENTIDO: eligió cuántas [[UNIDADES]] y todavía no manda sus datos. Ej.: «mándeme 1», «kiero los 2», «deme el de tres», «el del medio», o lo dice en audio. Pase variables_capturadas cantidad ('1', '2' o '3'). Si ya mandó sus datos completos, no salga: registre el pedido."
     },
     {
      "id": "avisar_dueno",
      "descripcion": "Por SENTIDO: no sabe leer o pide que le hablen por audio («no se leer», «mándeme audio», «no me escriba, dígame por audio») y ninguna pieza contesta lo que pregunta: se le avisa al dueño para que entre. Contéstele igual en una línea simple."
     },
     {
      "id": "no_interesado",
      "descripcion": "Dijo claro que no le interesa o que no le escriban más."
     },
     {
      "id": "humano",
      "es_humano": true,
      "descripcion": "SOLO si está muy enojado: insulta, amenaza o reclama fuerte y repetido. Pedir audio, fotos o preguntar si es original no es motivo."
     }
    ],
    "keywords_escape": [],
    "max_turnos": 30,
    "timeout_min": 1440
   }
  },
  {
   "id": "n4_pedido",
   "type": "ceder_ia",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "objetivo": "Tomar los 3 datos (nombre, teléfono si es otro, dirección; en audio o escritos) de quien ya eligió cuántas [[UNIDADES]] y registrar el pedido contra entrega en ese mismo turno, sin volver a vender ni empujar otro paquete. De usted, 1 o 2 líneas.",
    "contexto": "*TRATO:* siempre de usted; «don» y «doña» solo junto al nombre del cliente («don Carlos»): si no sabe su nombre, ningún tratamiento (ni «don», «doña», «amigo», «caballero», «joven», «señor» ni «estimado»), tampoco al cerrar una frase; si pregunta por otros productos, ver_otros_productos y vuelva a su pedido; texto justo y genuino, 1 o 2 líneas, una sola pregunta. Si llama al producto con otra palabra, use la suya: no corrija al cliente ni sus redondeos.\nYA ELIGIÓ: tocó un botón o dijo cuántas [[UNIDADES]] (mírelo en el historial). *IMPORTANTE:* si eligió 1, no le ofrezca el de 2 ni le hable de ahorro. Precios: 1 [[UNIDAD]] {{precio_1x}} · 2 [[UNIDADES]] {{precio_2x}} · 3 [[UNIDADES]] {{precio_3x}}. [[ENVIO]]. Contra entrega por defecto: paga en efectivo al recibir; no le pregunte cómo paga. Transferencia con {{descuento_transferencia_pct}} % solo si la pide ({{precio_transferencia_1x}} / {{precio_transferencia_2x}} / {{precio_transferencia_3x}}): registrar_pedido con metodo_pago 'anticipado' y ese monto; luego los datos de la cuenta que da el sistema (nunca inventados) y la foto del comprobante.\nSOLO 3 DATOS: nombre, teléfono (solo si es otro distinto a este WhatsApp) y la dirección (la referencia, solo si no se entiende dónde queda: no la pida si ya dio un lugar conocido). Los acepta en audio o escritos. Saque departamento y ciudad de la dirección; si duda entre dos, pregunte en una línea con las dos opciones. Pida solo lo que falta, en una línea («Solo me falta su dirección»). Nunca pegue una lista de datos.\n*IMPORTANTE:* con nombre y dirección, llame registrar_pedido EN ESE TURNO: evento datos_completos, producto, cantidad, precio_total de esa cantidad, metodo_pago 'cod' y datos_envio (nombre, telefono, departamento, ciudad, direccion: solo la dirección y la referencia si la dio, sin comentarios; lo que pida el cliente va en nota). Después diga solo «Listo 🙌»: el resumen con el botón para confirmar lo manda el sistema. Nunca «¿confirma que todo está correcto?».\nNOTAS DEL CLIENTE: lo que pida aparte (que lo llamen antes, a qué hora, dónde dejarlo) va en el campo nota de registrar_pedido, nunca dentro de direccion. No prometa una llamada ni una hora: diga «Quedó anotada su petición».\nUNA PREGUNTA: no ofrezca otro producto ni adicionales mientras toma los datos; una sola pregunta por mensaje.\nFECHA: si lo quiere para 4 días o menos, registre con «Entregar el <día y fecha>» en la dirección. A 5 días o más, o si hoy no tiene dinero, salga por apartar: nunca se lo mande igual.\nDUDAS: conteste con seguridad en una línea y vuelva al dato que falta. Audio grabado solo si contesta justo lo que pregunta (original, entrega, precio, apartar); «cómo se usa» o «si funciona», a esta altura, en texto. *IMPORTANTE — AL SALIR POR UNA PIEZA:* su texto en ese turno es SOLO «Mire 👇», nada más: la pieza ya contesta (nunca la respuesta además del audio). Cada pieza una sola vez.\nENTREGA: si ya sabe su ciudad, use consultar_cobertura y pase ciudad_cliente y dias_ciudad al salir por entrega. Si solo hay punto de encuentro, explíquelo en texto. Retiro en oficina solo si lo pide. Zonas sin entrega: [[ZONAS_SIN_ENTREGA]].\nAUDIO: nunca diga que no puede mandar audios. Si la nota de voz trae un dato raro (otra ciudad, otro nombre, otro producto), pregunte en una línea en vez de adivinar. Si pide audio y ninguno sirve, conteste en una línea y salga por avisar_dueno.\nUna «k» no es un sí. Nunca ofrezca cancelar. Una persona solo si está muy enojado. Si ya registró y solo manda «ok» o «gracias»: «A la orden 😊» una vez.",
    "intents_salida": [
     {
      "id": "original",
      "descripcion": "Pieza: foto real del producto + audio. Por SENTIDO: duda de que sea auténtico o igual al del anuncio. Ej.: «¿es original?», «no es imitación, ¿verdad?», «¿es el mismo del video?», «¿es pirata?», «es orijinal?», «no será réplica?». Una vez por conversación."
     },
     {
      "id": "precio",
      "descripcion": "Pieza: audio con los precios de las 3 promociones. Por SENTIDO: vuelve a preguntar cuánto es, no entendió los números o los pide en audio («presio?», «cuanto bale al final», «dígamelo en audio»). Una vez por conversación."
     },
     {
      "id": "apartar",
      "descripcion": "Pieza: audio que ofrece apartárselo para su fecha. Por SENTIDO: hoy no tiene el dinero o lo quiere para 5 días o más («no tengo dinero ahorita», «hasta la quincena», «yoles escribo cuando tenga el dinero»). Solo la primera vez."
     },
     {
      "id": "reservar",
      "descripcion": "Ya escuchó el audio de apartar y sigue con dejarlo para otra fecha: pasa directo a apartarlo, sin audio."
     },
     {
      "id": "entrega",
      "descripcion": "Pieza: audio sobre la entrega. Por SENTIDO: cómo o cuándo le llega, oficina, trabajo o casa («cuando yega?», «tengo que ir a traerlo?», «me lo dejan en el trabajo?»). Si ya sabe su ciudad, pase variables_capturadas ciudad_cliente y dias_ciudad (de consultar_cobertura). No salga si en su municipio solo hay punto de encuentro. Una vez por conversación."
     },
     {
      "id": "avisar_dueno",
      "descripcion": "Por SENTIDO: no sabe leer o pide que le hablen por audio, y ninguna pieza contesta lo que pregunta: se le avisa al dueño para que entre. Contéstele igual en una línea simple."
     },
     {
      "id": "no_interesado",
      "descripcion": "Dijo claro que no le interesa o que no le escriban más."
     },
     {
      "id": "humano",
      "es_humano": true,
      "descripcion": "SOLO si está muy enojado: insulta, amenaza o reclama fuerte y repetido."
     }
    ],
    "keywords_escape": [],
    "max_turnos": 25,
    "timeout_min": 1440
   }
  },
  {
   "id": "n3_reserva",
   "type": "ceder_ia",
   "position": {
    "x": 0,
    "y": 0
   },
   "data": {
    "objetivo": "Apartar [[NOMBRE_CORTO]] para la fecha que diga el cliente (hoy no tiene dinero): la fecha la calcula usted y la confirma en una línea, y solo falta cuántas [[UNIDADES]]; sin registrar pedido y con el aviso agendado dos días antes. De usted, 1 o 2 líneas y, como mucho, una pregunta.",
    "contexto": "ETIQUETA: al entrar, update_crm con tags ['Comprará después']; al cerrar la reserva, '#reserva'. Solo esas dos y 'Alta intención de compra'.\n*TRATO:* siempre de usted; «don» y «doña» solo junto al nombre del cliente («don Carlos»): si no sabe su nombre, ningún tratamiento (ni «don», «doña», «amigo», «caballero», «joven», «señor» ni «estimado»), tampoco al cerrar una frase; si pregunta por otros productos, ver_otros_productos y vuelva a su pedido; 1 o 2 líneas, una sola pregunta. No corrija al cliente (cómo llama al producto, sus redondeos).\nYA ESCUCHÓ el audio que le ofrece apartárselo para el día que diga. *IMPORTANTE:* no le ofrezca mandarlo ya ni le insista en pedirlo hoy: sin dinero no se manda, se aparta. No invente una fecha que el cliente no insinuó; la que sí insinuó la calcula usted (ver SENTIDO COMÚN CON LAS FECHAS).\nPRECIOS: 1 [[UNIDAD]] {{precio_1x}}, 2 [[UNIDADES]] {{precio_2x}}, 3 [[UNIDADES]] {{precio_3x}}. [[ENVIO]] y paga al recibir. [[REGALO]]\nFECHAS (cálculo interno, no lo explique): a 4 días o menos de hoy es compra con la nota «Entregar el <día y fecha>» → salga por compra_hoy. A 5 días o más es reserva. SENTIDO COMÚN CON LAS FECHAS: el cliente casi nunca da una fecha exacta y la calcula usted; no se la vuelva a preguntar. Hoy más «unos quince días» es la fecha de dentro de 15 días; «la quincena» es el 15 o el 30 que viene; «el otro mes» es el día 1; «la otra semana» es el viernes de la otra semana; «un sábado» (u otro día de la semana) es el primer sábado a partir de esa fecha aproximada, o el próximo sábado si no dio otra referencia. Con eso fije la fecha y confírmesela en UNA línea («Listo, se lo dejo apartado para el sábado 21 de noviembre»; con nombre, «Listo, don Carlos, …»); solo cambia si él la corrige. Nunca le pida elegir entre dos fechas ni «qué día exacto». Solo pregunta el día si no dio NINGUNA referencia de tiempo, y esa pregunta se hace una sola vez en toda la conversación (el audio de apartar ya la hizo: si contestó algo, úsela).\n1. Para APARTAR solo hacen falta la fecha (la calcula usted) y cuántas [[UNIDADES]] (si todavía no eligió; una sola pregunta por mensaje). El nombre, el teléfono y la dirección NO se piden para apartar: se piden al confirmar, dos días antes. Si el cliente ya los manda, guárdelos. Si dice que él le escribe cuando tenga el dinero, acepte, calcule una fecha aproximada y apártelo igual: no insista.\n2. NO llame registrar_pedido: un pedido registrado se despacha de inmediato.\n3. Con fecha y cantidad (los datos, solo si ya los tiene): (a) update_crm con tags ['#reserva'] y fase 'caliente'; (b) proponer_seguimiento para dos días antes, a media mañana, con el mensaje 'Buenas, le escribo por [[NOMBRE_PRODUCTO]] que dejamos apartado para el <día y fecha>. ¿Se lo mando hoy para que le llegue ese día a la dirección que me dio?' (si todavía no dio su dirección, en vez de eso: 'Buenas, le escribo por [[NOMBRE_PRODUCTO]] que dejamos apartado para el <día y fecha>. ¿Se lo mando hoy? Solo necesito su nombre y su dirección.') y el motivo 'Reserva para <fecha>: confirmar y registrar el pedido con la nota Entregar el <día y fecha>'; (c) dígale en una línea que queda apartado para esa fecha; (d) salga por reserva_apartada con variables_capturadas fecha_reserva y paquete, y nombre, ciudad y direccion solo si los tiene.\n4. Si él mismo dice que lo quiere ya, o para 4 días o menos: compra_hoy.\nAUDIO: nunca diga que no puede mandar audios; si no sabe leer, contéstele con palabras simples, en una línea.\nNunca ofrezca cancelar. Una persona solo si está muy enojado.",
    "intents_salida": [
     {
      "id": "reserva_apartada",
      "descripcion": "Quedó apartado: el cliente dio una fecha o una referencia de tiempo a 5 días o más de hoy (la fecha la calculaste tú), ya sabes cuántas [[UNIDADES]] y corriste update_crm y proponer_seguimiento. Los datos de envío no hacen falta."
     },
     {
      "id": "compra_hoy",
      "descripcion": "Él mismo dice que lo quiere ya, o para una fecha a 4 días o menos de hoy."
     },
     {
      "id": "no_interesado",
      "descripcion": "Dijo claro que no le interesa o que no le escriban más."
     },
     {
      "id": "humano",
      "es_humano": true,
      "descripcion": "SOLO si está muy enojado: insulta, amenaza o reclama fuerte y repetido."
     }
    ],
    "keywords_escape": [],
    "max_turnos": 15,
    "timeout_min": 1440
   }
  }
 ],
 "edges": [
  {
   "id": "e1",
   "source": "n_entrada",
   "sourceHandle": "r_sin_bienvenida",
   "target": "m_bienvenida_pp"
  },
  {
   "id": "e2",
   "source": "n_entrada",
   "sourceHandle": "r_precio",
   "target": "m_bienvenida"
  },
  {
   "id": "e3",
   "source": "n_entrada",
   "sourceHandle": "r_pregunta",
   "target": "m_bienvenida_pp"
  },
  {
   "id": "e4",
   "source": "n_entrada",
   "sourceHandle": "else",
   "target": "m_bienvenida"
  },
  {
   "id": "e5",
   "source": "m_bienvenida",
   "sourceHandle": "b1",
   "target": "x_c1"
  },
  {
   "id": "e6",
   "source": "m_bienvenida",
   "sourceHandle": "b2",
   "target": "x_c2"
  },
  {
   "id": "e7",
   "source": "m_bienvenida",
   "sourceHandle": "b3",
   "target": "x_c3"
  },
  {
   "id": "e8",
   "source": "m_bienvenida",
   "sourceHandle": "otra",
   "target": "n_agente"
  },
  {
   "id": "e9",
   "source": "m_bienvenida",
   "sourceHandle": "sin_respuesta",
   "target": "s_4min"
  },
  {
   "id": "e10",
   "source": "m_bienvenida_pp",
   "sourceHandle": "out",
   "target": "n_agente"
  },
  {
   "id": "e11",
   "source": "s_4min",
   "sourceHandle": "b1",
   "target": "x_c1"
  },
  {
   "id": "e12",
   "source": "s_4min",
   "sourceHandle": "b2",
   "target": "x_c2"
  },
  {
   "id": "e13",
   "source": "s_4min",
   "sourceHandle": "b3",
   "target": "x_c3"
  },
  {
   "id": "e14",
   "source": "s_4min",
   "sourceHandle": "otra",
   "target": "n_agente"
  },
  {
   "id": "e15",
   "source": "s_4min",
   "sourceHandle": "sin_respuesta",
   "target": "s_1h"
  },
  {
   "id": "e16",
   "source": "s_1h",
   "sourceHandle": "b1",
   "target": "x_c1"
  },
  {
   "id": "e17",
   "source": "s_1h",
   "sourceHandle": "b2",
   "target": "x_c2"
  },
  {
   "id": "e18",
   "source": "s_1h",
   "sourceHandle": "b3",
   "target": "x_c3"
  },
  {
   "id": "e19",
   "source": "s_1h",
   "sourceHandle": "otra",
   "target": "n_agente"
  },
  {
   "id": "e20",
   "source": "m_vuelta_promo",
   "sourceHandle": "b1",
   "target": "x_c1"
  },
  {
   "id": "e21",
   "source": "m_vuelta_promo",
   "sourceHandle": "b2",
   "target": "x_c2"
  },
  {
   "id": "e22",
   "source": "m_vuelta_promo",
   "sourceHandle": "b3",
   "target": "x_c3"
  },
  {
   "id": "e23",
   "source": "m_vuelta_promo",
   "sourceHandle": "otra",
   "target": "n_agente"
  },
  {
   "id": "e24",
   "source": "x_c1",
   "sourceHandle": "out",
   "target": "m_datos"
  },
  {
   "id": "e25",
   "source": "x_c2",
   "sourceHandle": "out",
   "target": "m_datos"
  },
  {
   "id": "e26",
   "source": "x_c3",
   "sourceHandle": "out",
   "target": "m_datos"
  },
  {
   "id": "e27",
   "source": "x_compra",
   "sourceHandle": "out",
   "target": "m_datos"
  },
  {
   "id": "e28",
   "source": "m_datos",
   "sourceHandle": "out",
   "target": "w_datos"
  },
  {
   "id": "e29",
   "source": "w_datos",
   "sourceHandle": "out",
   "target": "s_10min"
  },
  {
   "id": "e30",
   "source": "w_datos",
   "sourceHandle": "cancelado",
   "target": "n4_pedido"
  },
  {
   "id": "e31",
   "source": "s_10min",
   "sourceHandle": "out",
   "target": "n4_pedido"
  },
  {
   "id": "e32",
   "source": "x_c1b",
   "sourceHandle": "out",
   "target": "w_datos"
  },
  {
   "id": "e33",
   "source": "m_vuelta_datos",
   "sourceHandle": "out",
   "target": "w_datos"
  },
  {
   "id": "e34",
   "source": "n_agente",
   "sourceHandle": "funciona_uso",
   "target": "p_a3"
  },
  {
   "id": "e35",
   "source": "n_agente",
   "sourceHandle": "original",
   "target": "p_a4"
  },
  {
   "id": "e36",
   "source": "n_agente",
   "sourceHandle": "precio",
   "target": "p_a5"
  },
  {
   "id": "e37",
   "source": "n_agente",
   "sourceHandle": "apartar",
   "target": "p_a6"
  },
  {
   "id": "e38",
   "source": "n_agente",
   "sourceHandle": "reservar",
   "target": "n3_reserva"
  },
  {
   "id": "e39",
   "source": "n_agente",
   "sourceHandle": "entrega",
   "target": "p_a7"
  },
  {
   "id": "e40",
   "source": "n_agente",
   "sourceHandle": "uno_o_caro",
   "target": "p_a8"
  },
  {
   "id": "e41",
   "source": "n_agente",
   "sourceHandle": "ver_producto",
   "target": "p_foto"
  },
  {
   "id": "e42",
   "source": "n_agente",
   "sourceHandle": "regalo",
   "target": "p_regalo"
  },
  {
   "id": "e43",
   "source": "n_agente",
   "sourceHandle": "ver_promos",
   "target": "m_vuelta_promo"
  },
  {
   "id": "e44",
   "source": "n_agente",
   "sourceHandle": "compra",
   "target": "x_compra"
  },
  {
   "id": "e45",
   "source": "n_agente",
   "sourceHandle": "avisar_dueno",
   "target": "n_avisar"
  },
  {
   "id": "e46",
   "source": "n4_pedido",
   "sourceHandle": "original",
   "target": "p_a4"
  },
  {
   "id": "e47",
   "source": "n4_pedido",
   "sourceHandle": "precio",
   "target": "p_a5"
  },
  {
   "id": "e48",
   "source": "n4_pedido",
   "sourceHandle": "apartar",
   "target": "p_a6"
  },
  {
   "id": "e49",
   "source": "n4_pedido",
   "sourceHandle": "reservar",
   "target": "n3_reserva"
  },
  {
   "id": "e50",
   "source": "n4_pedido",
   "sourceHandle": "entrega",
   "target": "p_a7"
  },
  {
   "id": "e51",
   "source": "n4_pedido",
   "sourceHandle": "avisar_dueno",
   "target": "n_avisar"
  },
  {
   "id": "e52",
   "source": "n3_reserva",
   "sourceHandle": "reserva_apartada",
   "target": "n_aviso_reserva"
  },
  {
   "id": "e53",
   "source": "n3_reserva",
   "sourceHandle": "compra_hoy",
   "target": "c_fase"
  },
  {
   "id": "e54",
   "source": "p_a3",
   "sourceHandle": "out",
   "target": "c_fase"
  },
  {
   "id": "e55",
   "source": "p_a4",
   "sourceHandle": "out",
   "target": "c_fase"
  },
  {
   "id": "e56",
   "source": "p_a5",
   "sourceHandle": "out",
   "target": "c_fase"
  },
  {
   "id": "e57",
   "source": "p_foto",
   "sourceHandle": "out",
   "target": "c_fase"
  },
  {
   "id": "e58",
   "source": "p_regalo",
   "sourceHandle": "out",
   "target": "c_fase"
  },
  {
   "id": "e59",
   "source": "p_a6",
   "sourceHandle": "out",
   "target": "n3_reserva"
  },
  {
   "id": "e60",
   "source": "p_a7",
   "sourceHandle": "out",
   "target": "c_a7"
  },
  {
   "id": "e61",
   "source": "c_a7",
   "sourceHandle": "r_dias",
   "target": "p_a7_dias"
  },
  {
   "id": "e62",
   "source": "c_a7",
   "sourceHandle": "else",
   "target": "p_a7_ciudad"
  },
  {
   "id": "e63",
   "source": "p_a7_dias",
   "sourceHandle": "out",
   "target": "c_fase"
  },
  {
   "id": "e64",
   "source": "p_a7_ciudad",
   "sourceHandle": "out",
   "target": "c_ag"
  },
  {
   "id": "e65",
   "source": "p_a8",
   "sourceHandle": "out",
   "target": "x_c1b"
  },
  {
   "id": "e66",
   "source": "c_fase",
   "sourceHandle": "r_eligio",
   "target": "m_vuelta_datos"
  },
  {
   "id": "e67",
   "source": "c_fase",
   "sourceHandle": "else",
   "target": "m_vuelta_promo"
  },
  {
   "id": "e68",
   "source": "c_ag",
   "sourceHandle": "r_eligio",
   "target": "n4_pedido"
  },
  {
   "id": "e69",
   "source": "c_ag",
   "sourceHandle": "else",
   "target": "n_agente"
  },
  {
   "id": "e70",
   "source": "n_avisar",
   "sourceHandle": "out",
   "target": "c_ag"
  }
 ]
}
```
