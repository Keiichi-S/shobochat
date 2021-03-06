import * as uuid from "uuid";
import { EntityManager, EntityRepository } from "typeorm";
import { DatabaseManager } from "../../database/DatabaseManager";
import { UserRepository } from "../repository/UserRepository";
import { ChannelRepository } from "../repository/ChannelRepository";
import { MessageEntity } from "../entity/MessageEntity";
import { Message } from "../../../common/Message";

@EntityRepository()
export class MessageRepository {
    /*
     * getCustomRepository を使って
     * TypeORM 側で初期化すること
     */
    constructor(private manager: EntityManager) {}

    private toMessage(messageEntity: MessageEntity): Message {
        const message: Message = {
            id: messageEntity.id,
            userId: messageEntity.user.id,
            channelName: messageEntity.channel.name,
            time: messageEntity.time,
            name: messageEntity.user.name,
            content: messageEntity.content
        };
        return message;
    }

    private toMessages(messageEntities: Array<MessageEntity>): Array<Message> {
        return messageEntities.map(messageEntity => this.toMessage(messageEntity));
    }

    async getById(messageId: string): Promise<Message> {
        const messageEntity = await this.manager
            .createQueryBuilder(MessageEntity, "message")
            .innerJoinAndSelect("message.user", "user") // message.user を user に aliasing
            .innerJoinAndSelect("message.channel", "channel")
            .where("message.id = :id", { id: messageId })
            .getOne();
        if (messageEntity === undefined) {
            throw new Error("not found");
        } else {
            return this.toMessage(messageEntity);
        }
    }

    async getAll(channelName: string): Promise<Array<Message>> {
        const messageEntities = await this.manager
            .createQueryBuilder(MessageEntity, "message")
            .innerJoinAndSelect("message.user", "user") // message.user を user に aliasing
            .innerJoinAndSelect("message.channel", "channel")
            .where("message.channel.name = :channelName", { channelName })
            .orderBy("time", "DESC")
            .getMany();

        if (messageEntities === undefined) {
            throw new Error("not found");
        } else {
            return this.toMessages(messageEntities);
        }
    }

    async getBeforeSpecifiedTime(channelName: string, fromTime: number, n: number): Promise<Array<Message>> {
        const messageEntities = await this.manager
            .createQueryBuilder(MessageEntity, "message")
            .innerJoinAndSelect("message.user", "user") // message.user を user に aliasing
            .innerJoinAndSelect("message.channel", "channel")
            .where("time < :time AND message.channelName = :channelName", {
                time: fromTime,
                channelName
            })
            .orderBy("time", "DESC")
            .limit(n)
            .getMany();

        if (messageEntities === undefined) {
            throw new Error("not found");
        } else {
            return this.toMessages(messageEntities);
        }
    }

    async getAllAfterSpecifiedTime(channelName: string, fromTime: number): Promise<Array<Message>> {
        const messageEntities = await this.manager
            .createQueryBuilder(MessageEntity, "message")
            .innerJoinAndSelect("message.user", "user") // message.user を user に aliasing
            .innerJoinAndSelect("message.channel", "channel")
            .where("time > :time AND message.channelName = :channelName", {
                time: fromTime,
                channelName
            })
            .orderBy("time", "DESC")
            .getMany();

        if (messageEntities === undefined) {
            throw new Error("not found");
        } else {
            return this.toMessages(messageEntities);
        }
    }

    async getAllByTime(channelName: string, time: number): Promise<Array<Message>> {
        const messageEntities = await this.manager
            .createQueryBuilder(MessageEntity, "message")
            .innerJoinAndSelect("message.user", "user") // message.user を user に aliasing
            .innerJoinAndSelect("message.channel", "channel")
            .where("time = :time AND message.channelName = :channelName", {
                time,
                channelName
            })
            .getMany();

        if (messageEntities === undefined) {
            throw new Error("not found");
        } else {
            return this.toMessages(messageEntities);
        }
    }

    async insertAndGetId(channelName: string, userId: number, content: string): Promise<string> {
        const databaseManager = await DatabaseManager.getInstance();
        const userRepository = databaseManager.getRepository(UserRepository);
        const channelRepository = databaseManager.getRepository(ChannelRepository);

        const messageEntity: MessageEntity = this.manager.create(MessageEntity); // const messageEntity = new MessageEntity() と同じ
        await new Promise(resolve => setTimeout(resolve, 1));
        messageEntity.id = uuid.v4();
        messageEntity.time = Date.now();
        messageEntity.content = content;
        messageEntity.user = await userRepository.getEntityById(userId);
        messageEntity.channel = await channelRepository.getByName(channelName);
        await this.manager.save(messageEntity);

        const messageId = this.manager.getId(messageEntity);
        return messageId;
    }

    async updateById(messageId: string, content: string): Promise<void> {
        await this.manager
            .createQueryBuilder(MessageEntity, "message")
            .update(MessageEntity)
            .set({ content })
            .where("id = :id", { id: messageId })
            .execute();
    }

    async deleteById(messageId: string): Promise<void> {
        await this.manager
            .createQueryBuilder(MessageEntity, "message")
            .delete()
            .from(MessageEntity)
            .where("id = :id", { id: messageId })
            .execute();
    }

    async deleteByChannel(channel: string): Promise<void> {
        await this.manager
            .createQueryBuilder(MessageEntity, "message")
            .leftJoinAndSelect("message.channel", "channel")
            .where("channel = :channel", { channel })
            .delete()
            .execute();
    }

    create() {
        return this.manager.create(MessageEntity);
    }

    async save(messageEntity: MessageEntity) {
        await this.manager.save(messageEntity);
    }

    getId(messageEntity: MessageEntity) {
        return this.manager.getId(messageEntity);
    }
}
