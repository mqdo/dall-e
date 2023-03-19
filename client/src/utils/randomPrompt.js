const RANDOM_PROMPTS = [
  'A smiling cat wearing a top hat and holding a cane',
  'A group of penguins playing soccer on a snowy field',
  'A giraffe wearing sunglasses and riding a bicycle',
  'A panda baking a cake in a kitchen filled with balloons',
  'A mermaid swimming with a school of tropical fish',
  'A robot walking a dog in a futuristic cityscape',
  'A dragon lounging on a pile of treasure in a cave',
  'A unicorn playing the piano in a forest clearing',
  'A koala riding a surfboard in a wave pool',
  'A hummingbird sipping nectar from a flower garden',
  'A wizard conjuring a magical spell in a library',
  'A fox and a rabbit sitting on a teeter-totter',
  'A giant octopus holding a ship in its tentacles',
  'A kangaroo boxing a kangaroo in a boxing ring',
  'A monkey juggling bananas in a circus tent',
  'A parrot flying over a tropical island at sunset',
  'A hippopotamus wearing a tutu and dancing ballet',
  'A knight riding a horse through a medieval village',
  'A snowman playing a guitar on a mountaintop',
  'A space alien exploring a desert planet with a rover',
];

const generateRandomPrompt = (prompt) => {
  const randomNumber = Math.floor(Math.random() * 20);
  if (RANDOM_PROMPTS[randomNumber] === prompt) {
    generateRandomPrompt(prompt);
  }
  return RANDOM_PROMPTS[randomNumber];
}

export default generateRandomPrompt;