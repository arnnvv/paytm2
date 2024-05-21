import db from "../index";

(async () => {
  try {
    const alice = await db.user.upsert({
      where: { number: "9999999999" },
      update: {},
      create: {
        number: "9999999999",
        password: "alice",
        name: "alice",
        OnRampTransaction: {
          create: {
            startTime: new Date(),
            status: "Success",
            amount: 20000,
            token: "122",
            provider: "HDFC Bank",
          },
        },
      },
    });

    const bob = await db.user.upsert({
      where: { number: "9999999998" },
      update: {},
      create: {
        number: "9999999998",
        password: "bob",
        name: "bob",
        OnRampTransaction: {
          create: {
            startTime: new Date(),
            status: "Failure",
            amount: 2000,
            token: "123",
            provider: "HDFC Bank",
          },
        },
      },
    });

    console.log({ alice, bob });
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
})();
