import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "../entities/UserEntity";
import { User } from "../User";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {

    async getByName(name: string): Promise<User> {
        const user = await this.createQueryBuilder("user")
            .where("user.name = :name", { name })
            .getOne();

        if (user === undefined) { // 参考：https://stackoverflow.com/questions/42453683/how-to-reject-in-async-await-syntax
            throw new Error("not found");
        } else {
            return user;
        }
    }

    async hasName(name: string): Promise<boolean> {
        const user = await this.createQueryBuilder("user")
            .where("user.name = :name", { name })
            .getOne();

        return !!user;
    }

    // insert された user の user id をプロミスに入れて返す
    async insertAndGetId(name: string, password: string): Promise<number> {

        const insertResult = await this.createQueryBuilder()
            .insert()
            .into(UserEntity)
            .values([
                { name: name, password: password }, 
            ])
            .execute();

        if (insertResult === undefined) { 
            throw new Error("insert failed");
        } else {
            return insertResult.identifiers[0].id;
        }
    }
}
