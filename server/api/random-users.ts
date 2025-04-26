export default defineEventHandler(() => {
  return [
    {
      name: "Paul",
      description: "I had a nice day at the summer festival 🙌🎉",
      profilePicture: "/img/Paul.jpg",
      contentImage: "/img/festival.jpg",
      tag: "@paulrhyn",
      likes: 20,
    },
    {
      name: "Robin Smalls",
      description: "Picnic with the family 💘❤",
      profilePicture: "/img/Robin.jpg",
      contentImage: "/img/picnic.jpg",
      tag: "@robthesmall",
      likes: 40,
    },
    {
      name: "John",
      description: "Everyone should start lifting today! 🏋️‍♀️",
      profilePicture: "/img/John.jpg",
      contentImage: "/img/gym.jpg",
      tag: "@johnprks",
      likes: 26,
    },
  ];
});
