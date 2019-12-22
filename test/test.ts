import { app } from "../src/server";
import * as request from "supertest";
import * as assert from "assert";
import * as fs from "fs";
import { isMessage } from "../src/Message";
import { initializeDB, getMessage, getAllMessages, getUserByName } from "../src/dbHandler";

//let cookie: Array<string>;

async function postTestMessage(times: number, cookie: Array<string>): Promise<void> {
    const agent = request.agent(app);

    for (let i = 0; i < times; i++) {
        await agent
            .post("/messages")
            .set("Content-Type", "application/json")
            .send({ name: "test_name", message: "test_message" })
            .set("Cookie", cookie);
    }
}

function deleteDB() {
    try {
        fs.unlinkSync("sqlite3.db");
    } catch (err) {
        console.log(err);
    }
}

describe("GET /", () => {
    const agent = request.agent(app);
    let cookie: Array<string>;

    before(async () => {
        try {
            await initializeDB();
        } catch (err) {
            console.log(err);
        }
    });

    after(() => {
        deleteDB();
    });

    it("return top page", async () => {
        const response = await agent
            .get("/")
            .set("Accept", "text/html")
            .expect("Content-Type", "text/html; charset=utf-8");
        cookie = response.header["set-cookie"];
    });
});

describe("GET /messages", () => {
    const agent = request.agent(app);
    let cookie: Array<string>;

    before(async () => {
        try {
            await initializeDB();

            const response = await agent.get("/")
            cookie = response.header["set-cookie"];

            await agent
                .post("/register")
                .send({ name: "test", password: "test"})

            await postTestMessage(3, cookie);


        } catch (err) {
            console.log(err);
        }
    });

    after(() => {
        deleteDB();
    });

    it("return messages in response.body", async () => {
        const response = await agent
            .get("/messages")
            .set("Accept", "application/json")
            .set("Cookie", cookie)
            .expect("Content-Type", /application\/json/)
            .expect(200);

        assert.strictEqual(Array.isArray(response.body), true);
        const messages = response.body as Array<any>;
        messages.forEach((m => {
            assert.strictEqual(isMessage(m), true);
        }));
    });
});

describe("POST /messages", () => {

    const agent = request.agent(app);
    let cookie: Array<string>;

    before(async () => {
        try {
            await initializeDB();

            const response = await agent.get("/")
            cookie = response.header["set-cookie"];

            await agent
                .post("/register")
                .send({ name: "test", password: "test"})

        } catch (err) {
            console.log(err);
        }
    });

    after(() => {
        deleteDB();
    });

    it("returns 200 when parameters are valid", async () => {
        await agent
            .post("/messages")
            .set("Content-Type", "application/json")
            .send({ name: "test_name", message: "test_message" })
            .set("Cookie", cookie)
            .expect(200);
    });
});

describe("DELETE /messages", () => {
    let cookie: Array<string>;
    const agent = request.agent(app);
    const testId = 1;

    before(async () => {
        try {
            await initializeDB();

            const response = await agent.get("/")
            cookie = response.header["set-cookie"];

            await agent
                .post("/register")
                .send({ name: "test", password: "test"})

            await postTestMessage(1, cookie);

        } catch (err) {
            console.log(err);
        }
    });

    after(() => {
        deleteDB();
    });

    it("delete message with id = " + testId, async () => {
        const response = await agent
            .delete("/messages/" + testId)
            .set("Cookie", cookie)
            .expect(200);
        const message = await getMessage(testId);
        assert.strictEqual(message, undefined);
    });
});

describe("test for register and login", () => {
    const agent = request.agent(app);
    const name = "hoge";
    const password = "fuga";
    before(async () => {
        try {
            await initializeDB();
        } catch (err) {
            console.log(err);
        }
    });
    after(() => {
        deleteDB();
    });
    it(`register and login user with name = ${name}, password = ${password}`, async () => {
        {
            const response = await agent
                .post("/register")
                .send({ name: name, password: password })
                .expect(302);
            try {
                const user = await getUserByName(name);
                assert.strictEqual(user.name, name);
                assert.strictEqual(user.password, password);
            } catch (err) {
                console.log(err);
            }
        }
        {
            const response = await agent
                .get("/login")
                .send({ name: name, password: password })
                .expect(302);
        }
    });
});
