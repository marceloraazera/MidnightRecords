import React, {useState} from "react";
import {View, StyleSheet, Text, Image, FlatList} from 'react-native'

const discografia = [
  {
    id: "the-queen-is-dead",
    nome: "The Queen Is Dead",
    autor: "The Smiths",
    descricao: "Álbum clássico do rock alternativo britânico com letras melancólicas e instrumentais marcantes. Uma das obras mais icônicas dos anos 80.",
    precoCheio: 299.90,
    precoDesconto: 250.00
  },

  {
    id: "super-real-me",
    nome: "Super Real Me",
    autor: "ILLIT",
    descricao: "Mini álbum moderno do k-pop com sonoridade leve, energética e estética jovem. Mistura pop eletrônico com refrões viciantes.",
    precoCheio: 299.90,
    precoDesconto: 250.00
  },

  {
    id: "ocean-blvd",
    nome: "Ocean Blvd",
    autor: "Lana Del Rey",
    descricao: "Projeto introspectivo e cinematográfico com vocais suaves e produção emocional. Um dos trabalhos mais profundos da cantora.",
    precoCheio: 299.90,
    precoDesconto: 250.00
  },

  {
    id: "guts",
    nome: "GUTS",
    autor: "Olivia Rodrigo",
    descricao: "Álbum intenso e autêntico que mistura pop rock, emoções adolescentes e letras marcantes. Repleto de faixas explosivas e sentimentais.",
    precoCheio: 299.90,
    precoDesconto: 250.00
  }
]

export default discografia()