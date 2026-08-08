
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model RefreshToken
 * 
 */
export type RefreshToken = $Result.DefaultSelection<Prisma.$RefreshTokenPayload>
/**
 * Model Resume
 * 
 */
export type Resume = $Result.DefaultSelection<Prisma.$ResumePayload>
/**
 * Model Skill
 * 
 */
export type Skill = $Result.DefaultSelection<Prisma.$SkillPayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model RoleSkillRequirement
 * 
 */
export type RoleSkillRequirement = $Result.DefaultSelection<Prisma.$RoleSkillRequirementPayload>
/**
 * Model CareerAnalysis
 * 
 */
export type CareerAnalysis = $Result.DefaultSelection<Prisma.$CareerAnalysisPayload>
/**
 * Model CandidateSkillEvidence
 * 
 */
export type CandidateSkillEvidence = $Result.DefaultSelection<Prisma.$CandidateSkillEvidencePayload>
/**
 * Model SkillGap
 * 
 */
export type SkillGap = $Result.DefaultSelection<Prisma.$SkillGapPayload>
/**
 * Model Roadmap
 * 
 */
export type Roadmap = $Result.DefaultSelection<Prisma.$RoadmapPayload>
/**
 * Model RoadmapTask
 * 
 */
export type RoadmapTask = $Result.DefaultSelection<Prisma.$RoadmapTaskPayload>
/**
 * Model AnalysisEvent
 * 
 */
export type AnalysisEvent = $Result.DefaultSelection<Prisma.$AnalysisEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const SkillImportance: {
  critical: 'critical',
  important: 'important',
  nice_to_have: 'nice_to_have'
};

export type SkillImportance = (typeof SkillImportance)[keyof typeof SkillImportance]


export const EvidenceStrength: {
  experience_backed: 'experience_backed',
  project_backed: 'project_backed',
  mentioned: 'mentioned'
};

export type EvidenceStrength = (typeof EvidenceStrength)[keyof typeof EvidenceStrength]


export const GapStatus: {
  strong: 'strong',
  developing: 'developing',
  weak_evidence: 'weak_evidence',
  missing: 'missing'
};

export type GapStatus = (typeof GapStatus)[keyof typeof GapStatus]


export const CareerAnalysisStatus: {
  pending: 'pending',
  analyzing: 'analyzing',
  complete: 'complete',
  failed: 'failed'
};

export type CareerAnalysisStatus = (typeof CareerAnalysisStatus)[keyof typeof CareerAnalysisStatus]


export const AnalysisEventType: {
  analysis_started: 'analysis_started',
  analysis_completed: 'analysis_completed',
  analysis_failed: 'analysis_failed',
  roadmap_generated: 'roadmap_generated',
  task_completed: 'task_completed',
  task_uncompleted: 'task_uncompleted'
};

export type AnalysisEventType = (typeof AnalysisEventType)[keyof typeof AnalysisEventType]

}

export type SkillImportance = $Enums.SkillImportance

export const SkillImportance: typeof $Enums.SkillImportance

export type EvidenceStrength = $Enums.EvidenceStrength

export const EvidenceStrength: typeof $Enums.EvidenceStrength

export type GapStatus = $Enums.GapStatus

export const GapStatus: typeof $Enums.GapStatus

export type CareerAnalysisStatus = $Enums.CareerAnalysisStatus

export const CareerAnalysisStatus: typeof $Enums.CareerAnalysisStatus

export type AnalysisEventType = $Enums.AnalysisEventType

export const AnalysisEventType: typeof $Enums.AnalysisEventType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RefreshTokens
    * const refreshTokens = await prisma.refreshToken.findMany()
    * ```
    */
  get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resume`: Exposes CRUD operations for the **Resume** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Resumes
    * const resumes = await prisma.resume.findMany()
    * ```
    */
  get resume(): Prisma.ResumeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.skill`: Exposes CRUD operations for the **Skill** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Skills
    * const skills = await prisma.skill.findMany()
    * ```
    */
  get skill(): Prisma.SkillDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roleSkillRequirement`: Exposes CRUD operations for the **RoleSkillRequirement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoleSkillRequirements
    * const roleSkillRequirements = await prisma.roleSkillRequirement.findMany()
    * ```
    */
  get roleSkillRequirement(): Prisma.RoleSkillRequirementDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.careerAnalysis`: Exposes CRUD operations for the **CareerAnalysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CareerAnalyses
    * const careerAnalyses = await prisma.careerAnalysis.findMany()
    * ```
    */
  get careerAnalysis(): Prisma.CareerAnalysisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.candidateSkillEvidence`: Exposes CRUD operations for the **CandidateSkillEvidence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CandidateSkillEvidences
    * const candidateSkillEvidences = await prisma.candidateSkillEvidence.findMany()
    * ```
    */
  get candidateSkillEvidence(): Prisma.CandidateSkillEvidenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.skillGap`: Exposes CRUD operations for the **SkillGap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SkillGaps
    * const skillGaps = await prisma.skillGap.findMany()
    * ```
    */
  get skillGap(): Prisma.SkillGapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roadmap`: Exposes CRUD operations for the **Roadmap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roadmaps
    * const roadmaps = await prisma.roadmap.findMany()
    * ```
    */
  get roadmap(): Prisma.RoadmapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roadmapTask`: Exposes CRUD operations for the **RoadmapTask** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoadmapTasks
    * const roadmapTasks = await prisma.roadmapTask.findMany()
    * ```
    */
  get roadmapTask(): Prisma.RoadmapTaskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analysisEvent`: Exposes CRUD operations for the **AnalysisEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnalysisEvents
    * const analysisEvents = await prisma.analysisEvent.findMany()
    * ```
    */
  get analysisEvent(): Prisma.AnalysisEventDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    RefreshToken: 'RefreshToken',
    Resume: 'Resume',
    Skill: 'Skill',
    Role: 'Role',
    RoleSkillRequirement: 'RoleSkillRequirement',
    CareerAnalysis: 'CareerAnalysis',
    CandidateSkillEvidence: 'CandidateSkillEvidence',
    SkillGap: 'SkillGap',
    Roadmap: 'Roadmap',
    RoadmapTask: 'RoadmapTask',
    AnalysisEvent: 'AnalysisEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "refreshToken" | "resume" | "skill" | "role" | "roleSkillRequirement" | "careerAnalysis" | "candidateSkillEvidence" | "skillGap" | "roadmap" | "roadmapTask" | "analysisEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      RefreshToken: {
        payload: Prisma.$RefreshTokenPayload<ExtArgs>
        fields: Prisma.RefreshTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findMany: {
            args: Prisma.RefreshTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          create: {
            args: Prisma.RefreshTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          createMany: {
            args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          delete: {
            args: Prisma.RefreshTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          update: {
            args: Prisma.RefreshTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          upsert: {
            args: Prisma.RefreshTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.RefreshTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshToken>
          }
          groupBy: {
            args: Prisma.RefreshTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenCountAggregateOutputType> | number
          }
        }
      }
      Resume: {
        payload: Prisma.$ResumePayload<ExtArgs>
        fields: Prisma.ResumeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResumeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResumeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          findFirst: {
            args: Prisma.ResumeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResumeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          findMany: {
            args: Prisma.ResumeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          create: {
            args: Prisma.ResumeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          createMany: {
            args: Prisma.ResumeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResumeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          delete: {
            args: Prisma.ResumeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          update: {
            args: Prisma.ResumeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          deleteMany: {
            args: Prisma.ResumeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResumeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResumeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          upsert: {
            args: Prisma.ResumeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          aggregate: {
            args: Prisma.ResumeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResume>
          }
          groupBy: {
            args: Prisma.ResumeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResumeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResumeCountArgs<ExtArgs>
            result: $Utils.Optional<ResumeCountAggregateOutputType> | number
          }
        }
      }
      Skill: {
        payload: Prisma.$SkillPayload<ExtArgs>
        fields: Prisma.SkillFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SkillFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SkillFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          findFirst: {
            args: Prisma.SkillFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SkillFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          findMany: {
            args: Prisma.SkillFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          create: {
            args: Prisma.SkillCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          createMany: {
            args: Prisma.SkillCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SkillCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          delete: {
            args: Prisma.SkillDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          update: {
            args: Prisma.SkillUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          deleteMany: {
            args: Prisma.SkillDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SkillUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SkillUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          upsert: {
            args: Prisma.SkillUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          aggregate: {
            args: Prisma.SkillAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSkill>
          }
          groupBy: {
            args: Prisma.SkillGroupByArgs<ExtArgs>
            result: $Utils.Optional<SkillGroupByOutputType>[]
          }
          count: {
            args: Prisma.SkillCountArgs<ExtArgs>
            result: $Utils.Optional<SkillCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      RoleSkillRequirement: {
        payload: Prisma.$RoleSkillRequirementPayload<ExtArgs>
        fields: Prisma.RoleSkillRequirementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleSkillRequirementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleSkillRequirementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload>
          }
          findFirst: {
            args: Prisma.RoleSkillRequirementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleSkillRequirementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload>
          }
          findMany: {
            args: Prisma.RoleSkillRequirementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload>[]
          }
          create: {
            args: Prisma.RoleSkillRequirementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload>
          }
          createMany: {
            args: Prisma.RoleSkillRequirementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleSkillRequirementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload>[]
          }
          delete: {
            args: Prisma.RoleSkillRequirementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload>
          }
          update: {
            args: Prisma.RoleSkillRequirementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload>
          }
          deleteMany: {
            args: Prisma.RoleSkillRequirementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleSkillRequirementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleSkillRequirementUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload>[]
          }
          upsert: {
            args: Prisma.RoleSkillRequirementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleSkillRequirementPayload>
          }
          aggregate: {
            args: Prisma.RoleSkillRequirementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoleSkillRequirement>
          }
          groupBy: {
            args: Prisma.RoleSkillRequirementGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleSkillRequirementGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleSkillRequirementCountArgs<ExtArgs>
            result: $Utils.Optional<RoleSkillRequirementCountAggregateOutputType> | number
          }
        }
      }
      CareerAnalysis: {
        payload: Prisma.$CareerAnalysisPayload<ExtArgs>
        fields: Prisma.CareerAnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CareerAnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CareerAnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload>
          }
          findFirst: {
            args: Prisma.CareerAnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CareerAnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload>
          }
          findMany: {
            args: Prisma.CareerAnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload>[]
          }
          create: {
            args: Prisma.CareerAnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload>
          }
          createMany: {
            args: Prisma.CareerAnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CareerAnalysisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload>[]
          }
          delete: {
            args: Prisma.CareerAnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload>
          }
          update: {
            args: Prisma.CareerAnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload>
          }
          deleteMany: {
            args: Prisma.CareerAnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CareerAnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CareerAnalysisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload>[]
          }
          upsert: {
            args: Prisma.CareerAnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CareerAnalysisPayload>
          }
          aggregate: {
            args: Prisma.CareerAnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCareerAnalysis>
          }
          groupBy: {
            args: Prisma.CareerAnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<CareerAnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.CareerAnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<CareerAnalysisCountAggregateOutputType> | number
          }
        }
      }
      CandidateSkillEvidence: {
        payload: Prisma.$CandidateSkillEvidencePayload<ExtArgs>
        fields: Prisma.CandidateSkillEvidenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CandidateSkillEvidenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CandidateSkillEvidenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload>
          }
          findFirst: {
            args: Prisma.CandidateSkillEvidenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CandidateSkillEvidenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload>
          }
          findMany: {
            args: Prisma.CandidateSkillEvidenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload>[]
          }
          create: {
            args: Prisma.CandidateSkillEvidenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload>
          }
          createMany: {
            args: Prisma.CandidateSkillEvidenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CandidateSkillEvidenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload>[]
          }
          delete: {
            args: Prisma.CandidateSkillEvidenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload>
          }
          update: {
            args: Prisma.CandidateSkillEvidenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload>
          }
          deleteMany: {
            args: Prisma.CandidateSkillEvidenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CandidateSkillEvidenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CandidateSkillEvidenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload>[]
          }
          upsert: {
            args: Prisma.CandidateSkillEvidenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CandidateSkillEvidencePayload>
          }
          aggregate: {
            args: Prisma.CandidateSkillEvidenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCandidateSkillEvidence>
          }
          groupBy: {
            args: Prisma.CandidateSkillEvidenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<CandidateSkillEvidenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.CandidateSkillEvidenceCountArgs<ExtArgs>
            result: $Utils.Optional<CandidateSkillEvidenceCountAggregateOutputType> | number
          }
        }
      }
      SkillGap: {
        payload: Prisma.$SkillGapPayload<ExtArgs>
        fields: Prisma.SkillGapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SkillGapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SkillGapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload>
          }
          findFirst: {
            args: Prisma.SkillGapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SkillGapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload>
          }
          findMany: {
            args: Prisma.SkillGapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload>[]
          }
          create: {
            args: Prisma.SkillGapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload>
          }
          createMany: {
            args: Prisma.SkillGapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SkillGapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload>[]
          }
          delete: {
            args: Prisma.SkillGapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload>
          }
          update: {
            args: Prisma.SkillGapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload>
          }
          deleteMany: {
            args: Prisma.SkillGapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SkillGapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SkillGapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload>[]
          }
          upsert: {
            args: Prisma.SkillGapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillGapPayload>
          }
          aggregate: {
            args: Prisma.SkillGapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSkillGap>
          }
          groupBy: {
            args: Prisma.SkillGapGroupByArgs<ExtArgs>
            result: $Utils.Optional<SkillGapGroupByOutputType>[]
          }
          count: {
            args: Prisma.SkillGapCountArgs<ExtArgs>
            result: $Utils.Optional<SkillGapCountAggregateOutputType> | number
          }
        }
      }
      Roadmap: {
        payload: Prisma.$RoadmapPayload<ExtArgs>
        fields: Prisma.RoadmapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoadmapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoadmapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          findFirst: {
            args: Prisma.RoadmapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoadmapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          findMany: {
            args: Prisma.RoadmapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>[]
          }
          create: {
            args: Prisma.RoadmapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          createMany: {
            args: Prisma.RoadmapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoadmapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>[]
          }
          delete: {
            args: Prisma.RoadmapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          update: {
            args: Prisma.RoadmapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          deleteMany: {
            args: Prisma.RoadmapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoadmapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoadmapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>[]
          }
          upsert: {
            args: Prisma.RoadmapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapPayload>
          }
          aggregate: {
            args: Prisma.RoadmapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoadmap>
          }
          groupBy: {
            args: Prisma.RoadmapGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoadmapGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoadmapCountArgs<ExtArgs>
            result: $Utils.Optional<RoadmapCountAggregateOutputType> | number
          }
        }
      }
      RoadmapTask: {
        payload: Prisma.$RoadmapTaskPayload<ExtArgs>
        fields: Prisma.RoadmapTaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoadmapTaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoadmapTaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload>
          }
          findFirst: {
            args: Prisma.RoadmapTaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoadmapTaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload>
          }
          findMany: {
            args: Prisma.RoadmapTaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload>[]
          }
          create: {
            args: Prisma.RoadmapTaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload>
          }
          createMany: {
            args: Prisma.RoadmapTaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoadmapTaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload>[]
          }
          delete: {
            args: Prisma.RoadmapTaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload>
          }
          update: {
            args: Prisma.RoadmapTaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload>
          }
          deleteMany: {
            args: Prisma.RoadmapTaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoadmapTaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoadmapTaskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload>[]
          }
          upsert: {
            args: Prisma.RoadmapTaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoadmapTaskPayload>
          }
          aggregate: {
            args: Prisma.RoadmapTaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoadmapTask>
          }
          groupBy: {
            args: Prisma.RoadmapTaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoadmapTaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoadmapTaskCountArgs<ExtArgs>
            result: $Utils.Optional<RoadmapTaskCountAggregateOutputType> | number
          }
        }
      }
      AnalysisEvent: {
        payload: Prisma.$AnalysisEventPayload<ExtArgs>
        fields: Prisma.AnalysisEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalysisEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalysisEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload>
          }
          findFirst: {
            args: Prisma.AnalysisEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalysisEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload>
          }
          findMany: {
            args: Prisma.AnalysisEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload>[]
          }
          create: {
            args: Prisma.AnalysisEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload>
          }
          createMany: {
            args: Prisma.AnalysisEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalysisEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload>[]
          }
          delete: {
            args: Prisma.AnalysisEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload>
          }
          update: {
            args: Prisma.AnalysisEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload>
          }
          deleteMany: {
            args: Prisma.AnalysisEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalysisEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnalysisEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload>[]
          }
          upsert: {
            args: Prisma.AnalysisEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisEventPayload>
          }
          aggregate: {
            args: Prisma.AnalysisEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalysisEvent>
          }
          groupBy: {
            args: Prisma.AnalysisEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalysisEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalysisEventCountArgs<ExtArgs>
            result: $Utils.Optional<AnalysisEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    refreshToken?: RefreshTokenOmit
    resume?: ResumeOmit
    skill?: SkillOmit
    role?: RoleOmit
    roleSkillRequirement?: RoleSkillRequirementOmit
    careerAnalysis?: CareerAnalysisOmit
    candidateSkillEvidence?: CandidateSkillEvidenceOmit
    skillGap?: SkillGapOmit
    roadmap?: RoadmapOmit
    roadmapTask?: RoadmapTaskOmit
    analysisEvent?: AnalysisEventOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    resumes: number
    refreshTokens: number
    analyses: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resumes?: boolean | UserCountOutputTypeCountResumesArgs
    refreshTokens?: boolean | UserCountOutputTypeCountRefreshTokensArgs
    analyses?: boolean | UserCountOutputTypeCountAnalysesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountResumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CareerAnalysisWhereInput
  }


  /**
   * Count Type ResumeCountOutputType
   */

  export type ResumeCountOutputType = {
    analyses: number
  }

  export type ResumeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    analyses?: boolean | ResumeCountOutputTypeCountAnalysesArgs
  }

  // Custom InputTypes
  /**
   * ResumeCountOutputType without action
   */
  export type ResumeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeCountOutputType
     */
    select?: ResumeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ResumeCountOutputType without action
   */
  export type ResumeCountOutputTypeCountAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CareerAnalysisWhereInput
  }


  /**
   * Count Type SkillCountOutputType
   */

  export type SkillCountOutputType = {
    requirements: number
    evidence: number
    gaps: number
  }

  export type SkillCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requirements?: boolean | SkillCountOutputTypeCountRequirementsArgs
    evidence?: boolean | SkillCountOutputTypeCountEvidenceArgs
    gaps?: boolean | SkillCountOutputTypeCountGapsArgs
  }

  // Custom InputTypes
  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCountOutputType
     */
    select?: SkillCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeCountRequirementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleSkillRequirementWhereInput
  }

  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeCountEvidenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CandidateSkillEvidenceWhereInput
  }

  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeCountGapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillGapWhereInput
  }


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    requirements: number
    analyses: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requirements?: boolean | RoleCountOutputTypeCountRequirementsArgs
    analyses?: boolean | RoleCountOutputTypeCountAnalysesArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountRequirementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleSkillRequirementWhereInput
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CareerAnalysisWhereInput
  }


  /**
   * Count Type CareerAnalysisCountOutputType
   */

  export type CareerAnalysisCountOutputType = {
    evidence: number
    gaps: number
    events: number
  }

  export type CareerAnalysisCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evidence?: boolean | CareerAnalysisCountOutputTypeCountEvidenceArgs
    gaps?: boolean | CareerAnalysisCountOutputTypeCountGapsArgs
    events?: boolean | CareerAnalysisCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * CareerAnalysisCountOutputType without action
   */
  export type CareerAnalysisCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysisCountOutputType
     */
    select?: CareerAnalysisCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CareerAnalysisCountOutputType without action
   */
  export type CareerAnalysisCountOutputTypeCountEvidenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CandidateSkillEvidenceWhereInput
  }

  /**
   * CareerAnalysisCountOutputType without action
   */
  export type CareerAnalysisCountOutputTypeCountGapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillGapWhereInput
  }

  /**
   * CareerAnalysisCountOutputType without action
   */
  export type CareerAnalysisCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisEventWhereInput
  }


  /**
   * Count Type SkillGapCountOutputType
   */

  export type SkillGapCountOutputType = {
    tasks: number
  }

  export type SkillGapCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | SkillGapCountOutputTypeCountTasksArgs
  }

  // Custom InputTypes
  /**
   * SkillGapCountOutputType without action
   */
  export type SkillGapCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGapCountOutputType
     */
    select?: SkillGapCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SkillGapCountOutputType without action
   */
  export type SkillGapCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapTaskWhereInput
  }


  /**
   * Count Type RoadmapCountOutputType
   */

  export type RoadmapCountOutputType = {
    tasks: number
  }

  export type RoadmapCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | RoadmapCountOutputTypeCountTasksArgs
  }

  // Custom InputTypes
  /**
   * RoadmapCountOutputType without action
   */
  export type RoadmapCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapCountOutputType
     */
    select?: RoadmapCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoadmapCountOutputType without action
   */
  export type RoadmapCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapTaskWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resumes?: boolean | User$resumesArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    analyses?: boolean | User$analysesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resumes?: boolean | User$resumesArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    analyses?: boolean | User$analysesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      resumes: Prisma.$ResumePayload<ExtArgs>[]
      refreshTokens: Prisma.$RefreshTokenPayload<ExtArgs>[]
      analyses: Prisma.$CareerAnalysisPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      passwordHash: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    resumes<T extends User$resumesArgs<ExtArgs> = {}>(args?: Subset<T, User$resumesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    refreshTokens<T extends User$refreshTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$refreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    analyses<T extends User$analysesArgs<ExtArgs> = {}>(args?: Subset<T, User$analysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.resumes
   */
  export type User$resumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    where?: ResumeWhereInput
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    cursor?: ResumeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * User.refreshTokens
   */
  export type User$refreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    cursor?: RefreshTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * User.analyses
   */
  export type User$analysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    where?: CareerAnalysisWhereInput
    orderBy?: CareerAnalysisOrderByWithRelationInput | CareerAnalysisOrderByWithRelationInput[]
    cursor?: CareerAnalysisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CareerAnalysisScalarFieldEnum | CareerAnalysisScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model RefreshToken
   */

  export type AggregateRefreshToken = {
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  export type RefreshTokenMinAggregateOutputType = {
    id: string | null
    familyId: string | null
    tokenHash: string | null
    userId: string | null
    expiresAt: Date | null
    createdAt: Date | null
    revokedAt: Date | null
  }

  export type RefreshTokenMaxAggregateOutputType = {
    id: string | null
    familyId: string | null
    tokenHash: string | null
    userId: string | null
    expiresAt: Date | null
    createdAt: Date | null
    revokedAt: Date | null
  }

  export type RefreshTokenCountAggregateOutputType = {
    id: number
    familyId: number
    tokenHash: number
    userId: number
    expiresAt: number
    createdAt: number
    revokedAt: number
    _all: number
  }


  export type RefreshTokenMinAggregateInputType = {
    id?: true
    familyId?: true
    tokenHash?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
    revokedAt?: true
  }

  export type RefreshTokenMaxAggregateInputType = {
    id?: true
    familyId?: true
    tokenHash?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
    revokedAt?: true
  }

  export type RefreshTokenCountAggregateInputType = {
    id?: true
    familyId?: true
    tokenHash?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
    revokedAt?: true
    _all?: true
  }

  export type RefreshTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshToken to aggregate.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RefreshTokens
    **/
    _count?: true | RefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type GetRefreshTokenAggregateType<T extends RefreshTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshToken[P]>
      : GetScalarType<T[P], AggregateRefreshToken[P]>
  }




  export type RefreshTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithAggregationInput | RefreshTokenOrderByWithAggregationInput[]
    by: RefreshTokenScalarFieldEnum[] | RefreshTokenScalarFieldEnum
    having?: RefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshTokenCountAggregateInputType | true
    _min?: RefreshTokenMinAggregateInputType
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type RefreshTokenGroupByOutputType = {
    id: string
    familyId: string
    tokenHash: string
    userId: string
    expiresAt: Date
    createdAt: Date
    revokedAt: Date | null
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  type GetRefreshTokenGroupByPayload<T extends RefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefreshTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
            : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
        }
      >
    >


  export type RefreshTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    familyId?: boolean
    tokenHash?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    familyId?: boolean
    tokenHash?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    familyId?: boolean
    tokenHash?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectScalar = {
    id?: boolean
    familyId?: boolean
    tokenHash?: boolean
    userId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    revokedAt?: boolean
  }

  export type RefreshTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "familyId" | "tokenHash" | "userId" | "expiresAt" | "createdAt" | "revokedAt", ExtArgs["result"]["refreshToken"]>
  export type RefreshTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RefreshTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RefreshToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      familyId: string
      tokenHash: string
      userId: string
      expiresAt: Date
      createdAt: Date
      revokedAt: Date | null
    }, ExtArgs["result"]["refreshToken"]>
    composites: {}
  }

  type RefreshTokenGetPayload<S extends boolean | null | undefined | RefreshTokenDefaultArgs> = $Result.GetResult<Prisma.$RefreshTokenPayload, S>

  type RefreshTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RefreshTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RefreshTokenCountAggregateInputType | true
    }

  export interface RefreshTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshToken'], meta: { name: 'RefreshToken' } }
    /**
     * Find zero or one RefreshToken that matches the filter.
     * @param {RefreshTokenFindUniqueArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshTokenFindUniqueArgs>(args: SelectSubset<T, RefreshTokenFindUniqueArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RefreshToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, RefreshTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshTokenFindFirstArgs>(args?: SelectSubset<T, RefreshTokenFindFirstArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, RefreshTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany()
     * 
     * // Get first 10 RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefreshTokenFindManyArgs>(args?: SelectSubset<T, RefreshTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RefreshToken.
     * @param {RefreshTokenCreateArgs} args - Arguments to create a RefreshToken.
     * @example
     * // Create one RefreshToken
     * const RefreshToken = await prisma.refreshToken.create({
     *   data: {
     *     // ... data to create a RefreshToken
     *   }
     * })
     * 
     */
    create<T extends RefreshTokenCreateArgs>(args: SelectSubset<T, RefreshTokenCreateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RefreshTokens.
     * @param {RefreshTokenCreateManyArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefreshTokenCreateManyArgs>(args?: SelectSubset<T, RefreshTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RefreshTokens and returns the data saved in the database.
     * @param {RefreshTokenCreateManyAndReturnArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RefreshTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, RefreshTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RefreshToken.
     * @param {RefreshTokenDeleteArgs} args - Arguments to delete one RefreshToken.
     * @example
     * // Delete one RefreshToken
     * const RefreshToken = await prisma.refreshToken.delete({
     *   where: {
     *     // ... filter to delete one RefreshToken
     *   }
     * })
     * 
     */
    delete<T extends RefreshTokenDeleteArgs>(args: SelectSubset<T, RefreshTokenDeleteArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RefreshToken.
     * @param {RefreshTokenUpdateArgs} args - Arguments to update one RefreshToken.
     * @example
     * // Update one RefreshToken
     * const refreshToken = await prisma.refreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefreshTokenUpdateArgs>(args: SelectSubset<T, RefreshTokenUpdateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RefreshTokens.
     * @param {RefreshTokenDeleteManyArgs} args - Arguments to filter RefreshTokens to delete.
     * @example
     * // Delete a few RefreshTokens
     * const { count } = await prisma.refreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefreshTokenDeleteManyArgs>(args?: SelectSubset<T, RefreshTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefreshTokenUpdateManyArgs>(args: SelectSubset<T, RefreshTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens and returns the data updated in the database.
     * @param {RefreshTokenUpdateManyAndReturnArgs} args - Arguments to update many RefreshTokens.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RefreshTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, RefreshTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RefreshToken.
     * @param {RefreshTokenUpsertArgs} args - Arguments to update or create a RefreshToken.
     * @example
     * // Update or create a RefreshToken
     * const refreshToken = await prisma.refreshToken.upsert({
     *   create: {
     *     // ... data to create a RefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshToken we want to update
     *   }
     * })
     */
    upsert<T extends RefreshTokenUpsertArgs>(args: SelectSubset<T, RefreshTokenUpsertArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenCountArgs} args - Arguments to filter RefreshTokens to count.
     * @example
     * // Count the number of RefreshTokens
     * const count = await prisma.refreshToken.count({
     *   where: {
     *     // ... the filter for the RefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends RefreshTokenCountArgs>(
      args?: Subset<T, RefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RefreshTokenAggregateArgs>(args: Subset<T, RefreshTokenAggregateArgs>): Prisma.PrismaPromise<GetRefreshTokenAggregateType<T>>

    /**
     * Group by RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: RefreshTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RefreshTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RefreshToken model
   */
  readonly fields: RefreshTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RefreshToken model
   */
  interface RefreshTokenFieldRefs {
    readonly id: FieldRef<"RefreshToken", 'String'>
    readonly familyId: FieldRef<"RefreshToken", 'String'>
    readonly tokenHash: FieldRef<"RefreshToken", 'String'>
    readonly userId: FieldRef<"RefreshToken", 'String'>
    readonly expiresAt: FieldRef<"RefreshToken", 'DateTime'>
    readonly createdAt: FieldRef<"RefreshToken", 'DateTime'>
    readonly revokedAt: FieldRef<"RefreshToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RefreshToken findUnique
   */
  export type RefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findUniqueOrThrow
   */
  export type RefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findFirst
   */
  export type RefreshTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findFirstOrThrow
   */
  export type RefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findMany
   */
  export type RefreshTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken create
   */
  export type RefreshTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a RefreshToken.
     */
    data: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
  }

  /**
   * RefreshToken createMany
   */
  export type RefreshTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshToken createManyAndReturn
   */
  export type RefreshTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken update
   */
  export type RefreshTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a RefreshToken.
     */
    data: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which RefreshToken to update.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken updateMany
   */
  export type RefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
  }

  /**
   * RefreshToken updateManyAndReturn
   */
  export type RefreshTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken upsert
   */
  export type RefreshTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the RefreshToken to update in case it exists.
     */
    where: RefreshTokenWhereUniqueInput
    /**
     * In case the RefreshToken found by the `where` argument doesn't exist, create a new RefreshToken with this data.
     */
    create: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
    /**
     * In case the RefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
  }

  /**
   * RefreshToken delete
   */
  export type RefreshTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter which RefreshToken to delete.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken deleteMany
   */
  export type RefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to delete
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to delete.
     */
    limit?: number
  }

  /**
   * RefreshToken without action
   */
  export type RefreshTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
  }


  /**
   * Model Resume
   */

  export type AggregateResume = {
    _count: ResumeCountAggregateOutputType | null
    _avg: ResumeAvgAggregateOutputType | null
    _sum: ResumeSumAggregateOutputType | null
    _min: ResumeMinAggregateOutputType | null
    _max: ResumeMaxAggregateOutputType | null
  }

  export type ResumeAvgAggregateOutputType = {
    fileSize: number | null
  }

  export type ResumeSumAggregateOutputType = {
    fileSize: number | null
  }

  export type ResumeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    originalFileName: string | null
    mimeType: string | null
    fileSize: number | null
    fileUrl: string | null
    filePath: string | null
    rawText: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ResumeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    originalFileName: string | null
    mimeType: string | null
    fileSize: number | null
    fileUrl: string | null
    filePath: string | null
    rawText: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ResumeCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    originalFileName: number
    mimeType: number
    fileSize: number
    fileUrl: number
    filePath: number
    rawText: number
    structuredResume: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ResumeAvgAggregateInputType = {
    fileSize?: true
  }

  export type ResumeSumAggregateInputType = {
    fileSize?: true
  }

  export type ResumeMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    originalFileName?: true
    mimeType?: true
    fileSize?: true
    fileUrl?: true
    filePath?: true
    rawText?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ResumeMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    originalFileName?: true
    mimeType?: true
    fileSize?: true
    fileUrl?: true
    filePath?: true
    rawText?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ResumeCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    originalFileName?: true
    mimeType?: true
    fileSize?: true
    fileUrl?: true
    filePath?: true
    rawText?: true
    structuredResume?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ResumeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resume to aggregate.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Resumes
    **/
    _count?: true | ResumeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ResumeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ResumeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResumeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResumeMaxAggregateInputType
  }

  export type GetResumeAggregateType<T extends ResumeAggregateArgs> = {
        [P in keyof T & keyof AggregateResume]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResume[P]>
      : GetScalarType<T[P], AggregateResume[P]>
  }




  export type ResumeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeWhereInput
    orderBy?: ResumeOrderByWithAggregationInput | ResumeOrderByWithAggregationInput[]
    by: ResumeScalarFieldEnum[] | ResumeScalarFieldEnum
    having?: ResumeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResumeCountAggregateInputType | true
    _avg?: ResumeAvgAggregateInputType
    _sum?: ResumeSumAggregateInputType
    _min?: ResumeMinAggregateInputType
    _max?: ResumeMaxAggregateInputType
  }

  export type ResumeGroupByOutputType = {
    id: string
    userId: string
    title: string
    originalFileName: string
    mimeType: string
    fileSize: number
    fileUrl: string
    filePath: string | null
    rawText: string
    structuredResume: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: ResumeCountAggregateOutputType | null
    _avg: ResumeAvgAggregateOutputType | null
    _sum: ResumeSumAggregateOutputType | null
    _min: ResumeMinAggregateOutputType | null
    _max: ResumeMaxAggregateOutputType | null
  }

  type GetResumeGroupByPayload<T extends ResumeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResumeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResumeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResumeGroupByOutputType[P]>
            : GetScalarType<T[P], ResumeGroupByOutputType[P]>
        }
      >
    >


  export type ResumeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    originalFileName?: boolean
    mimeType?: boolean
    fileSize?: boolean
    fileUrl?: boolean
    filePath?: boolean
    rawText?: boolean
    structuredResume?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    analyses?: boolean | Resume$analysesArgs<ExtArgs>
    _count?: boolean | ResumeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    originalFileName?: boolean
    mimeType?: boolean
    fileSize?: boolean
    fileUrl?: boolean
    filePath?: boolean
    rawText?: boolean
    structuredResume?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    originalFileName?: boolean
    mimeType?: boolean
    fileSize?: boolean
    fileUrl?: boolean
    filePath?: boolean
    rawText?: boolean
    structuredResume?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    originalFileName?: boolean
    mimeType?: boolean
    fileSize?: boolean
    fileUrl?: boolean
    filePath?: boolean
    rawText?: boolean
    structuredResume?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ResumeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "originalFileName" | "mimeType" | "fileSize" | "fileUrl" | "filePath" | "rawText" | "structuredResume" | "createdAt" | "updatedAt", ExtArgs["result"]["resume"]>
  export type ResumeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    analyses?: boolean | Resume$analysesArgs<ExtArgs>
    _count?: boolean | ResumeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ResumeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ResumeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ResumePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resume"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      analyses: Prisma.$CareerAnalysisPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      originalFileName: string
      mimeType: string
      fileSize: number
      fileUrl: string
      filePath: string | null
      rawText: string
      structuredResume: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["resume"]>
    composites: {}
  }

  type ResumeGetPayload<S extends boolean | null | undefined | ResumeDefaultArgs> = $Result.GetResult<Prisma.$ResumePayload, S>

  type ResumeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResumeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResumeCountAggregateInputType | true
    }

  export interface ResumeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resume'], meta: { name: 'Resume' } }
    /**
     * Find zero or one Resume that matches the filter.
     * @param {ResumeFindUniqueArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResumeFindUniqueArgs>(args: SelectSubset<T, ResumeFindUniqueArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resume that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResumeFindUniqueOrThrowArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResumeFindUniqueOrThrowArgs>(args: SelectSubset<T, ResumeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resume that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindFirstArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResumeFindFirstArgs>(args?: SelectSubset<T, ResumeFindFirstArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resume that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindFirstOrThrowArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResumeFindFirstOrThrowArgs>(args?: SelectSubset<T, ResumeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Resumes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Resumes
     * const resumes = await prisma.resume.findMany()
     * 
     * // Get first 10 Resumes
     * const resumes = await prisma.resume.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resumeWithIdOnly = await prisma.resume.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResumeFindManyArgs>(args?: SelectSubset<T, ResumeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resume.
     * @param {ResumeCreateArgs} args - Arguments to create a Resume.
     * @example
     * // Create one Resume
     * const Resume = await prisma.resume.create({
     *   data: {
     *     // ... data to create a Resume
     *   }
     * })
     * 
     */
    create<T extends ResumeCreateArgs>(args: SelectSubset<T, ResumeCreateArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Resumes.
     * @param {ResumeCreateManyArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resume = await prisma.resume.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResumeCreateManyArgs>(args?: SelectSubset<T, ResumeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Resumes and returns the data saved in the database.
     * @param {ResumeCreateManyAndReturnArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resume = await prisma.resume.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Resumes and only return the `id`
     * const resumeWithIdOnly = await prisma.resume.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResumeCreateManyAndReturnArgs>(args?: SelectSubset<T, ResumeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Resume.
     * @param {ResumeDeleteArgs} args - Arguments to delete one Resume.
     * @example
     * // Delete one Resume
     * const Resume = await prisma.resume.delete({
     *   where: {
     *     // ... filter to delete one Resume
     *   }
     * })
     * 
     */
    delete<T extends ResumeDeleteArgs>(args: SelectSubset<T, ResumeDeleteArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resume.
     * @param {ResumeUpdateArgs} args - Arguments to update one Resume.
     * @example
     * // Update one Resume
     * const resume = await prisma.resume.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResumeUpdateArgs>(args: SelectSubset<T, ResumeUpdateArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Resumes.
     * @param {ResumeDeleteManyArgs} args - Arguments to filter Resumes to delete.
     * @example
     * // Delete a few Resumes
     * const { count } = await prisma.resume.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResumeDeleteManyArgs>(args?: SelectSubset<T, ResumeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Resumes
     * const resume = await prisma.resume.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResumeUpdateManyArgs>(args: SelectSubset<T, ResumeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes and returns the data updated in the database.
     * @param {ResumeUpdateManyAndReturnArgs} args - Arguments to update many Resumes.
     * @example
     * // Update many Resumes
     * const resume = await prisma.resume.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Resumes and only return the `id`
     * const resumeWithIdOnly = await prisma.resume.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResumeUpdateManyAndReturnArgs>(args: SelectSubset<T, ResumeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Resume.
     * @param {ResumeUpsertArgs} args - Arguments to update or create a Resume.
     * @example
     * // Update or create a Resume
     * const resume = await prisma.resume.upsert({
     *   create: {
     *     // ... data to create a Resume
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resume we want to update
     *   }
     * })
     */
    upsert<T extends ResumeUpsertArgs>(args: SelectSubset<T, ResumeUpsertArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeCountArgs} args - Arguments to filter Resumes to count.
     * @example
     * // Count the number of Resumes
     * const count = await prisma.resume.count({
     *   where: {
     *     // ... the filter for the Resumes we want to count
     *   }
     * })
    **/
    count<T extends ResumeCountArgs>(
      args?: Subset<T, ResumeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResumeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resume.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResumeAggregateArgs>(args: Subset<T, ResumeAggregateArgs>): Prisma.PrismaPromise<GetResumeAggregateType<T>>

    /**
     * Group by Resume.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResumeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResumeGroupByArgs['orderBy'] }
        : { orderBy?: ResumeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResumeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResumeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resume model
   */
  readonly fields: ResumeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resume.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResumeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    analyses<T extends Resume$analysesArgs<ExtArgs> = {}>(args?: Subset<T, Resume$analysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Resume model
   */
  interface ResumeFieldRefs {
    readonly id: FieldRef<"Resume", 'String'>
    readonly userId: FieldRef<"Resume", 'String'>
    readonly title: FieldRef<"Resume", 'String'>
    readonly originalFileName: FieldRef<"Resume", 'String'>
    readonly mimeType: FieldRef<"Resume", 'String'>
    readonly fileSize: FieldRef<"Resume", 'Int'>
    readonly fileUrl: FieldRef<"Resume", 'String'>
    readonly filePath: FieldRef<"Resume", 'String'>
    readonly rawText: FieldRef<"Resume", 'String'>
    readonly structuredResume: FieldRef<"Resume", 'Json'>
    readonly createdAt: FieldRef<"Resume", 'DateTime'>
    readonly updatedAt: FieldRef<"Resume", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Resume findUnique
   */
  export type ResumeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume findUniqueOrThrow
   */
  export type ResumeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume findFirst
   */
  export type ResumeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume findFirstOrThrow
   */
  export type ResumeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume findMany
   */
  export type ResumeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resumes to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume create
   */
  export type ResumeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The data needed to create a Resume.
     */
    data: XOR<ResumeCreateInput, ResumeUncheckedCreateInput>
  }

  /**
   * Resume createMany
   */
  export type ResumeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Resumes.
     */
    data: ResumeCreateManyInput | ResumeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resume createManyAndReturn
   */
  export type ResumeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * The data used to create many Resumes.
     */
    data: ResumeCreateManyInput | ResumeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resume update
   */
  export type ResumeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The data needed to update a Resume.
     */
    data: XOR<ResumeUpdateInput, ResumeUncheckedUpdateInput>
    /**
     * Choose, which Resume to update.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume updateMany
   */
  export type ResumeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Resumes.
     */
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyInput>
    /**
     * Filter which Resumes to update
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to update.
     */
    limit?: number
  }

  /**
   * Resume updateManyAndReturn
   */
  export type ResumeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * The data used to update Resumes.
     */
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyInput>
    /**
     * Filter which Resumes to update
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resume upsert
   */
  export type ResumeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The filter to search for the Resume to update in case it exists.
     */
    where: ResumeWhereUniqueInput
    /**
     * In case the Resume found by the `where` argument doesn't exist, create a new Resume with this data.
     */
    create: XOR<ResumeCreateInput, ResumeUncheckedCreateInput>
    /**
     * In case the Resume was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResumeUpdateInput, ResumeUncheckedUpdateInput>
  }

  /**
   * Resume delete
   */
  export type ResumeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter which Resume to delete.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume deleteMany
   */
  export type ResumeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resumes to delete
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to delete.
     */
    limit?: number
  }

  /**
   * Resume.analyses
   */
  export type Resume$analysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    where?: CareerAnalysisWhereInput
    orderBy?: CareerAnalysisOrderByWithRelationInput | CareerAnalysisOrderByWithRelationInput[]
    cursor?: CareerAnalysisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CareerAnalysisScalarFieldEnum | CareerAnalysisScalarFieldEnum[]
  }

  /**
   * Resume without action
   */
  export type ResumeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
  }


  /**
   * Model Skill
   */

  export type AggregateSkill = {
    _count: SkillCountAggregateOutputType | null
    _min: SkillMinAggregateOutputType | null
    _max: SkillMaxAggregateOutputType | null
  }

  export type SkillMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SkillMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SkillCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    aliases: number
    category: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SkillMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SkillMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SkillCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    aliases?: true
    category?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SkillAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Skill to aggregate.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Skills
    **/
    _count?: true | SkillCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SkillMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SkillMaxAggregateInputType
  }

  export type GetSkillAggregateType<T extends SkillAggregateArgs> = {
        [P in keyof T & keyof AggregateSkill]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSkill[P]>
      : GetScalarType<T[P], AggregateSkill[P]>
  }




  export type SkillGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillWhereInput
    orderBy?: SkillOrderByWithAggregationInput | SkillOrderByWithAggregationInput[]
    by: SkillScalarFieldEnum[] | SkillScalarFieldEnum
    having?: SkillScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SkillCountAggregateInputType | true
    _min?: SkillMinAggregateInputType
    _max?: SkillMaxAggregateInputType
  }

  export type SkillGroupByOutputType = {
    id: string
    slug: string
    name: string
    aliases: string[]
    category: string | null
    createdAt: Date
    updatedAt: Date
    _count: SkillCountAggregateOutputType | null
    _min: SkillMinAggregateOutputType | null
    _max: SkillMaxAggregateOutputType | null
  }

  type GetSkillGroupByPayload<T extends SkillGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SkillGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SkillGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SkillGroupByOutputType[P]>
            : GetScalarType<T[P], SkillGroupByOutputType[P]>
        }
      >
    >


  export type SkillSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    aliases?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requirements?: boolean | Skill$requirementsArgs<ExtArgs>
    evidence?: boolean | Skill$evidenceArgs<ExtArgs>
    gaps?: boolean | Skill$gapsArgs<ExtArgs>
    _count?: boolean | SkillCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    aliases?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    aliases?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    aliases?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SkillOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "name" | "aliases" | "category" | "createdAt" | "updatedAt", ExtArgs["result"]["skill"]>
  export type SkillInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requirements?: boolean | Skill$requirementsArgs<ExtArgs>
    evidence?: boolean | Skill$evidenceArgs<ExtArgs>
    gaps?: boolean | Skill$gapsArgs<ExtArgs>
    _count?: boolean | SkillCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SkillIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SkillIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SkillPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Skill"
    objects: {
      requirements: Prisma.$RoleSkillRequirementPayload<ExtArgs>[]
      evidence: Prisma.$CandidateSkillEvidencePayload<ExtArgs>[]
      gaps: Prisma.$SkillGapPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      aliases: string[]
      category: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["skill"]>
    composites: {}
  }

  type SkillGetPayload<S extends boolean | null | undefined | SkillDefaultArgs> = $Result.GetResult<Prisma.$SkillPayload, S>

  type SkillCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SkillFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SkillCountAggregateInputType | true
    }

  export interface SkillDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Skill'], meta: { name: 'Skill' } }
    /**
     * Find zero or one Skill that matches the filter.
     * @param {SkillFindUniqueArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SkillFindUniqueArgs>(args: SelectSubset<T, SkillFindUniqueArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Skill that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SkillFindUniqueOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SkillFindUniqueOrThrowArgs>(args: SelectSubset<T, SkillFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Skill that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindFirstArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SkillFindFirstArgs>(args?: SelectSubset<T, SkillFindFirstArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Skill that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindFirstOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SkillFindFirstOrThrowArgs>(args?: SelectSubset<T, SkillFindFirstOrThrowArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Skills that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Skills
     * const skills = await prisma.skill.findMany()
     * 
     * // Get first 10 Skills
     * const skills = await prisma.skill.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const skillWithIdOnly = await prisma.skill.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SkillFindManyArgs>(args?: SelectSubset<T, SkillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Skill.
     * @param {SkillCreateArgs} args - Arguments to create a Skill.
     * @example
     * // Create one Skill
     * const Skill = await prisma.skill.create({
     *   data: {
     *     // ... data to create a Skill
     *   }
     * })
     * 
     */
    create<T extends SkillCreateArgs>(args: SelectSubset<T, SkillCreateArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Skills.
     * @param {SkillCreateManyArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SkillCreateManyArgs>(args?: SelectSubset<T, SkillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Skills and returns the data saved in the database.
     * @param {SkillCreateManyAndReturnArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Skills and only return the `id`
     * const skillWithIdOnly = await prisma.skill.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SkillCreateManyAndReturnArgs>(args?: SelectSubset<T, SkillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Skill.
     * @param {SkillDeleteArgs} args - Arguments to delete one Skill.
     * @example
     * // Delete one Skill
     * const Skill = await prisma.skill.delete({
     *   where: {
     *     // ... filter to delete one Skill
     *   }
     * })
     * 
     */
    delete<T extends SkillDeleteArgs>(args: SelectSubset<T, SkillDeleteArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Skill.
     * @param {SkillUpdateArgs} args - Arguments to update one Skill.
     * @example
     * // Update one Skill
     * const skill = await prisma.skill.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SkillUpdateArgs>(args: SelectSubset<T, SkillUpdateArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Skills.
     * @param {SkillDeleteManyArgs} args - Arguments to filter Skills to delete.
     * @example
     * // Delete a few Skills
     * const { count } = await prisma.skill.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SkillDeleteManyArgs>(args?: SelectSubset<T, SkillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Skills
     * const skill = await prisma.skill.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SkillUpdateManyArgs>(args: SelectSubset<T, SkillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Skills and returns the data updated in the database.
     * @param {SkillUpdateManyAndReturnArgs} args - Arguments to update many Skills.
     * @example
     * // Update many Skills
     * const skill = await prisma.skill.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Skills and only return the `id`
     * const skillWithIdOnly = await prisma.skill.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SkillUpdateManyAndReturnArgs>(args: SelectSubset<T, SkillUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Skill.
     * @param {SkillUpsertArgs} args - Arguments to update or create a Skill.
     * @example
     * // Update or create a Skill
     * const skill = await prisma.skill.upsert({
     *   create: {
     *     // ... data to create a Skill
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Skill we want to update
     *   }
     * })
     */
    upsert<T extends SkillUpsertArgs>(args: SelectSubset<T, SkillUpsertArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCountArgs} args - Arguments to filter Skills to count.
     * @example
     * // Count the number of Skills
     * const count = await prisma.skill.count({
     *   where: {
     *     // ... the filter for the Skills we want to count
     *   }
     * })
    **/
    count<T extends SkillCountArgs>(
      args?: Subset<T, SkillCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SkillCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Skill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SkillAggregateArgs>(args: Subset<T, SkillAggregateArgs>): Prisma.PrismaPromise<GetSkillAggregateType<T>>

    /**
     * Group by Skill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SkillGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SkillGroupByArgs['orderBy'] }
        : { orderBy?: SkillGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SkillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSkillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Skill model
   */
  readonly fields: SkillFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Skill.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SkillClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    requirements<T extends Skill$requirementsArgs<ExtArgs> = {}>(args?: Subset<T, Skill$requirementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    evidence<T extends Skill$evidenceArgs<ExtArgs> = {}>(args?: Subset<T, Skill$evidenceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gaps<T extends Skill$gapsArgs<ExtArgs> = {}>(args?: Subset<T, Skill$gapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Skill model
   */
  interface SkillFieldRefs {
    readonly id: FieldRef<"Skill", 'String'>
    readonly slug: FieldRef<"Skill", 'String'>
    readonly name: FieldRef<"Skill", 'String'>
    readonly aliases: FieldRef<"Skill", 'String[]'>
    readonly category: FieldRef<"Skill", 'String'>
    readonly createdAt: FieldRef<"Skill", 'DateTime'>
    readonly updatedAt: FieldRef<"Skill", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Skill findUnique
   */
  export type SkillFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill findUniqueOrThrow
   */
  export type SkillFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill findFirst
   */
  export type SkillFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill findFirstOrThrow
   */
  export type SkillFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill findMany
   */
  export type SkillFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skills to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill create
   */
  export type SkillCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The data needed to create a Skill.
     */
    data: XOR<SkillCreateInput, SkillUncheckedCreateInput>
  }

  /**
   * Skill createMany
   */
  export type SkillCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Skills.
     */
    data: SkillCreateManyInput | SkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Skill createManyAndReturn
   */
  export type SkillCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * The data used to create many Skills.
     */
    data: SkillCreateManyInput | SkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Skill update
   */
  export type SkillUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The data needed to update a Skill.
     */
    data: XOR<SkillUpdateInput, SkillUncheckedUpdateInput>
    /**
     * Choose, which Skill to update.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill updateMany
   */
  export type SkillUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Skills.
     */
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyInput>
    /**
     * Filter which Skills to update
     */
    where?: SkillWhereInput
    /**
     * Limit how many Skills to update.
     */
    limit?: number
  }

  /**
   * Skill updateManyAndReturn
   */
  export type SkillUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * The data used to update Skills.
     */
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyInput>
    /**
     * Filter which Skills to update
     */
    where?: SkillWhereInput
    /**
     * Limit how many Skills to update.
     */
    limit?: number
  }

  /**
   * Skill upsert
   */
  export type SkillUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The filter to search for the Skill to update in case it exists.
     */
    where: SkillWhereUniqueInput
    /**
     * In case the Skill found by the `where` argument doesn't exist, create a new Skill with this data.
     */
    create: XOR<SkillCreateInput, SkillUncheckedCreateInput>
    /**
     * In case the Skill was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SkillUpdateInput, SkillUncheckedUpdateInput>
  }

  /**
   * Skill delete
   */
  export type SkillDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter which Skill to delete.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill deleteMany
   */
  export type SkillDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Skills to delete
     */
    where?: SkillWhereInput
    /**
     * Limit how many Skills to delete.
     */
    limit?: number
  }

  /**
   * Skill.requirements
   */
  export type Skill$requirementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    where?: RoleSkillRequirementWhereInput
    orderBy?: RoleSkillRequirementOrderByWithRelationInput | RoleSkillRequirementOrderByWithRelationInput[]
    cursor?: RoleSkillRequirementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoleSkillRequirementScalarFieldEnum | RoleSkillRequirementScalarFieldEnum[]
  }

  /**
   * Skill.evidence
   */
  export type Skill$evidenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    where?: CandidateSkillEvidenceWhereInput
    orderBy?: CandidateSkillEvidenceOrderByWithRelationInput | CandidateSkillEvidenceOrderByWithRelationInput[]
    cursor?: CandidateSkillEvidenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CandidateSkillEvidenceScalarFieldEnum | CandidateSkillEvidenceScalarFieldEnum[]
  }

  /**
   * Skill.gaps
   */
  export type Skill$gapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    where?: SkillGapWhereInput
    orderBy?: SkillGapOrderByWithRelationInput | SkillGapOrderByWithRelationInput[]
    cursor?: SkillGapWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SkillGapScalarFieldEnum | SkillGapScalarFieldEnum[]
  }

  /**
   * Skill without action
   */
  export type SkillDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleMinAggregateOutputType = {
    id: string | null
    slug: string | null
    title: string | null
    description: string | null
    seedVersion: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    title: string | null
    description: string | null
    seedVersion: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    slug: number
    title: number
    description: number
    seedVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoleMinAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    description?: true
    seedVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    description?: true
    seedVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    description?: true
    seedVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: string
    slug: string
    title: string
    description: string
    seedVersion: string
    createdAt: Date
    updatedAt: Date
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    seedVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requirements?: boolean | Role$requirementsArgs<ExtArgs>
    analyses?: boolean | Role$analysesArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    seedVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    seedVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    seedVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "title" | "description" | "seedVersion" | "createdAt" | "updatedAt", ExtArgs["result"]["role"]>
  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requirements?: boolean | Role$requirementsArgs<ExtArgs>
    analyses?: boolean | Role$analysesArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      requirements: Prisma.$RoleSkillRequirementPayload<ExtArgs>[]
      analyses: Prisma.$CareerAnalysisPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      title: string
      description: string
      seedVersion: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {RoleUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    requirements<T extends Role$requirementsArgs<ExtArgs> = {}>(args?: Subset<T, Role$requirementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    analyses<T extends Role$analysesArgs<ExtArgs> = {}>(args?: Subset<T, Role$analysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'String'>
    readonly slug: FieldRef<"Role", 'String'>
    readonly title: FieldRef<"Role", 'String'>
    readonly description: FieldRef<"Role", 'String'>
    readonly seedVersion: FieldRef<"Role", 'String'>
    readonly createdAt: FieldRef<"Role", 'DateTime'>
    readonly updatedAt: FieldRef<"Role", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role updateManyAndReturn
   */
  export type RoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role.requirements
   */
  export type Role$requirementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    where?: RoleSkillRequirementWhereInput
    orderBy?: RoleSkillRequirementOrderByWithRelationInput | RoleSkillRequirementOrderByWithRelationInput[]
    cursor?: RoleSkillRequirementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoleSkillRequirementScalarFieldEnum | RoleSkillRequirementScalarFieldEnum[]
  }

  /**
   * Role.analyses
   */
  export type Role$analysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    where?: CareerAnalysisWhereInput
    orderBy?: CareerAnalysisOrderByWithRelationInput | CareerAnalysisOrderByWithRelationInput[]
    cursor?: CareerAnalysisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CareerAnalysisScalarFieldEnum | CareerAnalysisScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model RoleSkillRequirement
   */

  export type AggregateRoleSkillRequirement = {
    _count: RoleSkillRequirementCountAggregateOutputType | null
    _min: RoleSkillRequirementMinAggregateOutputType | null
    _max: RoleSkillRequirementMaxAggregateOutputType | null
  }

  export type RoleSkillRequirementMinAggregateOutputType = {
    id: string | null
    roleId: string | null
    skillId: string | null
    importance: $Enums.SkillImportance | null
    rationale: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleSkillRequirementMaxAggregateOutputType = {
    id: string | null
    roleId: string | null
    skillId: string | null
    importance: $Enums.SkillImportance | null
    rationale: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleSkillRequirementCountAggregateOutputType = {
    id: number
    roleId: number
    skillId: number
    importance: number
    rationale: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoleSkillRequirementMinAggregateInputType = {
    id?: true
    roleId?: true
    skillId?: true
    importance?: true
    rationale?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleSkillRequirementMaxAggregateInputType = {
    id?: true
    roleId?: true
    skillId?: true
    importance?: true
    rationale?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleSkillRequirementCountAggregateInputType = {
    id?: true
    roleId?: true
    skillId?: true
    importance?: true
    rationale?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoleSkillRequirementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleSkillRequirement to aggregate.
     */
    where?: RoleSkillRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleSkillRequirements to fetch.
     */
    orderBy?: RoleSkillRequirementOrderByWithRelationInput | RoleSkillRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleSkillRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleSkillRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleSkillRequirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoleSkillRequirements
    **/
    _count?: true | RoleSkillRequirementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleSkillRequirementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleSkillRequirementMaxAggregateInputType
  }

  export type GetRoleSkillRequirementAggregateType<T extends RoleSkillRequirementAggregateArgs> = {
        [P in keyof T & keyof AggregateRoleSkillRequirement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoleSkillRequirement[P]>
      : GetScalarType<T[P], AggregateRoleSkillRequirement[P]>
  }




  export type RoleSkillRequirementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleSkillRequirementWhereInput
    orderBy?: RoleSkillRequirementOrderByWithAggregationInput | RoleSkillRequirementOrderByWithAggregationInput[]
    by: RoleSkillRequirementScalarFieldEnum[] | RoleSkillRequirementScalarFieldEnum
    having?: RoleSkillRequirementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleSkillRequirementCountAggregateInputType | true
    _min?: RoleSkillRequirementMinAggregateInputType
    _max?: RoleSkillRequirementMaxAggregateInputType
  }

  export type RoleSkillRequirementGroupByOutputType = {
    id: string
    roleId: string
    skillId: string
    importance: $Enums.SkillImportance
    rationale: string
    createdAt: Date
    updatedAt: Date
    _count: RoleSkillRequirementCountAggregateOutputType | null
    _min: RoleSkillRequirementMinAggregateOutputType | null
    _max: RoleSkillRequirementMaxAggregateOutputType | null
  }

  type GetRoleSkillRequirementGroupByPayload<T extends RoleSkillRequirementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleSkillRequirementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleSkillRequirementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleSkillRequirementGroupByOutputType[P]>
            : GetScalarType<T[P], RoleSkillRequirementGroupByOutputType[P]>
        }
      >
    >


  export type RoleSkillRequirementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    skillId?: boolean
    importance?: boolean
    rationale?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleSkillRequirement"]>

  export type RoleSkillRequirementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    skillId?: boolean
    importance?: boolean
    rationale?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleSkillRequirement"]>

  export type RoleSkillRequirementSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    skillId?: boolean
    importance?: boolean
    rationale?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleSkillRequirement"]>

  export type RoleSkillRequirementSelectScalar = {
    id?: boolean
    roleId?: boolean
    skillId?: boolean
    importance?: boolean
    rationale?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoleSkillRequirementOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roleId" | "skillId" | "importance" | "rationale" | "createdAt" | "updatedAt", ExtArgs["result"]["roleSkillRequirement"]>
  export type RoleSkillRequirementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }
  export type RoleSkillRequirementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }
  export type RoleSkillRequirementIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }

  export type $RoleSkillRequirementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoleSkillRequirement"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      skill: Prisma.$SkillPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roleId: string
      skillId: string
      importance: $Enums.SkillImportance
      rationale: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["roleSkillRequirement"]>
    composites: {}
  }

  type RoleSkillRequirementGetPayload<S extends boolean | null | undefined | RoleSkillRequirementDefaultArgs> = $Result.GetResult<Prisma.$RoleSkillRequirementPayload, S>

  type RoleSkillRequirementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleSkillRequirementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleSkillRequirementCountAggregateInputType | true
    }

  export interface RoleSkillRequirementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoleSkillRequirement'], meta: { name: 'RoleSkillRequirement' } }
    /**
     * Find zero or one RoleSkillRequirement that matches the filter.
     * @param {RoleSkillRequirementFindUniqueArgs} args - Arguments to find a RoleSkillRequirement
     * @example
     * // Get one RoleSkillRequirement
     * const roleSkillRequirement = await prisma.roleSkillRequirement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleSkillRequirementFindUniqueArgs>(args: SelectSubset<T, RoleSkillRequirementFindUniqueArgs<ExtArgs>>): Prisma__RoleSkillRequirementClient<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoleSkillRequirement that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleSkillRequirementFindUniqueOrThrowArgs} args - Arguments to find a RoleSkillRequirement
     * @example
     * // Get one RoleSkillRequirement
     * const roleSkillRequirement = await prisma.roleSkillRequirement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleSkillRequirementFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleSkillRequirementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleSkillRequirementClient<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleSkillRequirement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleSkillRequirementFindFirstArgs} args - Arguments to find a RoleSkillRequirement
     * @example
     * // Get one RoleSkillRequirement
     * const roleSkillRequirement = await prisma.roleSkillRequirement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleSkillRequirementFindFirstArgs>(args?: SelectSubset<T, RoleSkillRequirementFindFirstArgs<ExtArgs>>): Prisma__RoleSkillRequirementClient<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleSkillRequirement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleSkillRequirementFindFirstOrThrowArgs} args - Arguments to find a RoleSkillRequirement
     * @example
     * // Get one RoleSkillRequirement
     * const roleSkillRequirement = await prisma.roleSkillRequirement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleSkillRequirementFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleSkillRequirementFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleSkillRequirementClient<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoleSkillRequirements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleSkillRequirementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoleSkillRequirements
     * const roleSkillRequirements = await prisma.roleSkillRequirement.findMany()
     * 
     * // Get first 10 RoleSkillRequirements
     * const roleSkillRequirements = await prisma.roleSkillRequirement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleSkillRequirementWithIdOnly = await prisma.roleSkillRequirement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleSkillRequirementFindManyArgs>(args?: SelectSubset<T, RoleSkillRequirementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoleSkillRequirement.
     * @param {RoleSkillRequirementCreateArgs} args - Arguments to create a RoleSkillRequirement.
     * @example
     * // Create one RoleSkillRequirement
     * const RoleSkillRequirement = await prisma.roleSkillRequirement.create({
     *   data: {
     *     // ... data to create a RoleSkillRequirement
     *   }
     * })
     * 
     */
    create<T extends RoleSkillRequirementCreateArgs>(args: SelectSubset<T, RoleSkillRequirementCreateArgs<ExtArgs>>): Prisma__RoleSkillRequirementClient<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoleSkillRequirements.
     * @param {RoleSkillRequirementCreateManyArgs} args - Arguments to create many RoleSkillRequirements.
     * @example
     * // Create many RoleSkillRequirements
     * const roleSkillRequirement = await prisma.roleSkillRequirement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleSkillRequirementCreateManyArgs>(args?: SelectSubset<T, RoleSkillRequirementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoleSkillRequirements and returns the data saved in the database.
     * @param {RoleSkillRequirementCreateManyAndReturnArgs} args - Arguments to create many RoleSkillRequirements.
     * @example
     * // Create many RoleSkillRequirements
     * const roleSkillRequirement = await prisma.roleSkillRequirement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoleSkillRequirements and only return the `id`
     * const roleSkillRequirementWithIdOnly = await prisma.roleSkillRequirement.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleSkillRequirementCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleSkillRequirementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoleSkillRequirement.
     * @param {RoleSkillRequirementDeleteArgs} args - Arguments to delete one RoleSkillRequirement.
     * @example
     * // Delete one RoleSkillRequirement
     * const RoleSkillRequirement = await prisma.roleSkillRequirement.delete({
     *   where: {
     *     // ... filter to delete one RoleSkillRequirement
     *   }
     * })
     * 
     */
    delete<T extends RoleSkillRequirementDeleteArgs>(args: SelectSubset<T, RoleSkillRequirementDeleteArgs<ExtArgs>>): Prisma__RoleSkillRequirementClient<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoleSkillRequirement.
     * @param {RoleSkillRequirementUpdateArgs} args - Arguments to update one RoleSkillRequirement.
     * @example
     * // Update one RoleSkillRequirement
     * const roleSkillRequirement = await prisma.roleSkillRequirement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleSkillRequirementUpdateArgs>(args: SelectSubset<T, RoleSkillRequirementUpdateArgs<ExtArgs>>): Prisma__RoleSkillRequirementClient<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoleSkillRequirements.
     * @param {RoleSkillRequirementDeleteManyArgs} args - Arguments to filter RoleSkillRequirements to delete.
     * @example
     * // Delete a few RoleSkillRequirements
     * const { count } = await prisma.roleSkillRequirement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleSkillRequirementDeleteManyArgs>(args?: SelectSubset<T, RoleSkillRequirementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleSkillRequirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleSkillRequirementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoleSkillRequirements
     * const roleSkillRequirement = await prisma.roleSkillRequirement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleSkillRequirementUpdateManyArgs>(args: SelectSubset<T, RoleSkillRequirementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleSkillRequirements and returns the data updated in the database.
     * @param {RoleSkillRequirementUpdateManyAndReturnArgs} args - Arguments to update many RoleSkillRequirements.
     * @example
     * // Update many RoleSkillRequirements
     * const roleSkillRequirement = await prisma.roleSkillRequirement.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoleSkillRequirements and only return the `id`
     * const roleSkillRequirementWithIdOnly = await prisma.roleSkillRequirement.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleSkillRequirementUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleSkillRequirementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoleSkillRequirement.
     * @param {RoleSkillRequirementUpsertArgs} args - Arguments to update or create a RoleSkillRequirement.
     * @example
     * // Update or create a RoleSkillRequirement
     * const roleSkillRequirement = await prisma.roleSkillRequirement.upsert({
     *   create: {
     *     // ... data to create a RoleSkillRequirement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoleSkillRequirement we want to update
     *   }
     * })
     */
    upsert<T extends RoleSkillRequirementUpsertArgs>(args: SelectSubset<T, RoleSkillRequirementUpsertArgs<ExtArgs>>): Prisma__RoleSkillRequirementClient<$Result.GetResult<Prisma.$RoleSkillRequirementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoleSkillRequirements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleSkillRequirementCountArgs} args - Arguments to filter RoleSkillRequirements to count.
     * @example
     * // Count the number of RoleSkillRequirements
     * const count = await prisma.roleSkillRequirement.count({
     *   where: {
     *     // ... the filter for the RoleSkillRequirements we want to count
     *   }
     * })
    **/
    count<T extends RoleSkillRequirementCountArgs>(
      args?: Subset<T, RoleSkillRequirementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleSkillRequirementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoleSkillRequirement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleSkillRequirementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleSkillRequirementAggregateArgs>(args: Subset<T, RoleSkillRequirementAggregateArgs>): Prisma.PrismaPromise<GetRoleSkillRequirementAggregateType<T>>

    /**
     * Group by RoleSkillRequirement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleSkillRequirementGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleSkillRequirementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleSkillRequirementGroupByArgs['orderBy'] }
        : { orderBy?: RoleSkillRequirementGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleSkillRequirementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleSkillRequirementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoleSkillRequirement model
   */
  readonly fields: RoleSkillRequirementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoleSkillRequirement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleSkillRequirementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    skill<T extends SkillDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SkillDefaultArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoleSkillRequirement model
   */
  interface RoleSkillRequirementFieldRefs {
    readonly id: FieldRef<"RoleSkillRequirement", 'String'>
    readonly roleId: FieldRef<"RoleSkillRequirement", 'String'>
    readonly skillId: FieldRef<"RoleSkillRequirement", 'String'>
    readonly importance: FieldRef<"RoleSkillRequirement", 'SkillImportance'>
    readonly rationale: FieldRef<"RoleSkillRequirement", 'String'>
    readonly createdAt: FieldRef<"RoleSkillRequirement", 'DateTime'>
    readonly updatedAt: FieldRef<"RoleSkillRequirement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoleSkillRequirement findUnique
   */
  export type RoleSkillRequirementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    /**
     * Filter, which RoleSkillRequirement to fetch.
     */
    where: RoleSkillRequirementWhereUniqueInput
  }

  /**
   * RoleSkillRequirement findUniqueOrThrow
   */
  export type RoleSkillRequirementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    /**
     * Filter, which RoleSkillRequirement to fetch.
     */
    where: RoleSkillRequirementWhereUniqueInput
  }

  /**
   * RoleSkillRequirement findFirst
   */
  export type RoleSkillRequirementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    /**
     * Filter, which RoleSkillRequirement to fetch.
     */
    where?: RoleSkillRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleSkillRequirements to fetch.
     */
    orderBy?: RoleSkillRequirementOrderByWithRelationInput | RoleSkillRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleSkillRequirements.
     */
    cursor?: RoleSkillRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleSkillRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleSkillRequirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleSkillRequirements.
     */
    distinct?: RoleSkillRequirementScalarFieldEnum | RoleSkillRequirementScalarFieldEnum[]
  }

  /**
   * RoleSkillRequirement findFirstOrThrow
   */
  export type RoleSkillRequirementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    /**
     * Filter, which RoleSkillRequirement to fetch.
     */
    where?: RoleSkillRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleSkillRequirements to fetch.
     */
    orderBy?: RoleSkillRequirementOrderByWithRelationInput | RoleSkillRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleSkillRequirements.
     */
    cursor?: RoleSkillRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleSkillRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleSkillRequirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleSkillRequirements.
     */
    distinct?: RoleSkillRequirementScalarFieldEnum | RoleSkillRequirementScalarFieldEnum[]
  }

  /**
   * RoleSkillRequirement findMany
   */
  export type RoleSkillRequirementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    /**
     * Filter, which RoleSkillRequirements to fetch.
     */
    where?: RoleSkillRequirementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleSkillRequirements to fetch.
     */
    orderBy?: RoleSkillRequirementOrderByWithRelationInput | RoleSkillRequirementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoleSkillRequirements.
     */
    cursor?: RoleSkillRequirementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleSkillRequirements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleSkillRequirements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleSkillRequirements.
     */
    distinct?: RoleSkillRequirementScalarFieldEnum | RoleSkillRequirementScalarFieldEnum[]
  }

  /**
   * RoleSkillRequirement create
   */
  export type RoleSkillRequirementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    /**
     * The data needed to create a RoleSkillRequirement.
     */
    data: XOR<RoleSkillRequirementCreateInput, RoleSkillRequirementUncheckedCreateInput>
  }

  /**
   * RoleSkillRequirement createMany
   */
  export type RoleSkillRequirementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoleSkillRequirements.
     */
    data: RoleSkillRequirementCreateManyInput | RoleSkillRequirementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoleSkillRequirement createManyAndReturn
   */
  export type RoleSkillRequirementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * The data used to create many RoleSkillRequirements.
     */
    data: RoleSkillRequirementCreateManyInput | RoleSkillRequirementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoleSkillRequirement update
   */
  export type RoleSkillRequirementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    /**
     * The data needed to update a RoleSkillRequirement.
     */
    data: XOR<RoleSkillRequirementUpdateInput, RoleSkillRequirementUncheckedUpdateInput>
    /**
     * Choose, which RoleSkillRequirement to update.
     */
    where: RoleSkillRequirementWhereUniqueInput
  }

  /**
   * RoleSkillRequirement updateMany
   */
  export type RoleSkillRequirementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoleSkillRequirements.
     */
    data: XOR<RoleSkillRequirementUpdateManyMutationInput, RoleSkillRequirementUncheckedUpdateManyInput>
    /**
     * Filter which RoleSkillRequirements to update
     */
    where?: RoleSkillRequirementWhereInput
    /**
     * Limit how many RoleSkillRequirements to update.
     */
    limit?: number
  }

  /**
   * RoleSkillRequirement updateManyAndReturn
   */
  export type RoleSkillRequirementUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * The data used to update RoleSkillRequirements.
     */
    data: XOR<RoleSkillRequirementUpdateManyMutationInput, RoleSkillRequirementUncheckedUpdateManyInput>
    /**
     * Filter which RoleSkillRequirements to update
     */
    where?: RoleSkillRequirementWhereInput
    /**
     * Limit how many RoleSkillRequirements to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoleSkillRequirement upsert
   */
  export type RoleSkillRequirementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    /**
     * The filter to search for the RoleSkillRequirement to update in case it exists.
     */
    where: RoleSkillRequirementWhereUniqueInput
    /**
     * In case the RoleSkillRequirement found by the `where` argument doesn't exist, create a new RoleSkillRequirement with this data.
     */
    create: XOR<RoleSkillRequirementCreateInput, RoleSkillRequirementUncheckedCreateInput>
    /**
     * In case the RoleSkillRequirement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleSkillRequirementUpdateInput, RoleSkillRequirementUncheckedUpdateInput>
  }

  /**
   * RoleSkillRequirement delete
   */
  export type RoleSkillRequirementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
    /**
     * Filter which RoleSkillRequirement to delete.
     */
    where: RoleSkillRequirementWhereUniqueInput
  }

  /**
   * RoleSkillRequirement deleteMany
   */
  export type RoleSkillRequirementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleSkillRequirements to delete
     */
    where?: RoleSkillRequirementWhereInput
    /**
     * Limit how many RoleSkillRequirements to delete.
     */
    limit?: number
  }

  /**
   * RoleSkillRequirement without action
   */
  export type RoleSkillRequirementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleSkillRequirement
     */
    select?: RoleSkillRequirementSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleSkillRequirement
     */
    omit?: RoleSkillRequirementOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleSkillRequirementInclude<ExtArgs> | null
  }


  /**
   * Model CareerAnalysis
   */

  export type AggregateCareerAnalysis = {
    _count: CareerAnalysisCountAggregateOutputType | null
    _avg: CareerAnalysisAvgAggregateOutputType | null
    _sum: CareerAnalysisSumAggregateOutputType | null
    _min: CareerAnalysisMinAggregateOutputType | null
    _max: CareerAnalysisMaxAggregateOutputType | null
  }

  export type CareerAnalysisAvgAggregateOutputType = {
    readinessScore: number | null
  }

  export type CareerAnalysisSumAggregateOutputType = {
    readinessScore: number | null
  }

  export type CareerAnalysisMinAggregateOutputType = {
    id: string | null
    userId: string | null
    status: $Enums.CareerAnalysisStatus | null
    resumeId: string | null
    roleId: string | null
    readinessScore: number | null
    failureReason: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type CareerAnalysisMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    status: $Enums.CareerAnalysisStatus | null
    resumeId: string | null
    roleId: string | null
    readinessScore: number | null
    failureReason: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type CareerAnalysisCountAggregateOutputType = {
    id: number
    userId: number
    status: number
    resumeId: number
    roleId: number
    resumeSnapshot: number
    roleSnapshot: number
    readinessScore: number
    readinessBreakdown: number
    failureReason: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type CareerAnalysisAvgAggregateInputType = {
    readinessScore?: true
  }

  export type CareerAnalysisSumAggregateInputType = {
    readinessScore?: true
  }

  export type CareerAnalysisMinAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    resumeId?: true
    roleId?: true
    readinessScore?: true
    failureReason?: true
    createdAt?: true
    completedAt?: true
  }

  export type CareerAnalysisMaxAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    resumeId?: true
    roleId?: true
    readinessScore?: true
    failureReason?: true
    createdAt?: true
    completedAt?: true
  }

  export type CareerAnalysisCountAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    resumeId?: true
    roleId?: true
    resumeSnapshot?: true
    roleSnapshot?: true
    readinessScore?: true
    readinessBreakdown?: true
    failureReason?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type CareerAnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CareerAnalysis to aggregate.
     */
    where?: CareerAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareerAnalyses to fetch.
     */
    orderBy?: CareerAnalysisOrderByWithRelationInput | CareerAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CareerAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareerAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareerAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CareerAnalyses
    **/
    _count?: true | CareerAnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CareerAnalysisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CareerAnalysisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CareerAnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CareerAnalysisMaxAggregateInputType
  }

  export type GetCareerAnalysisAggregateType<T extends CareerAnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregateCareerAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCareerAnalysis[P]>
      : GetScalarType<T[P], AggregateCareerAnalysis[P]>
  }




  export type CareerAnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CareerAnalysisWhereInput
    orderBy?: CareerAnalysisOrderByWithAggregationInput | CareerAnalysisOrderByWithAggregationInput[]
    by: CareerAnalysisScalarFieldEnum[] | CareerAnalysisScalarFieldEnum
    having?: CareerAnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CareerAnalysisCountAggregateInputType | true
    _avg?: CareerAnalysisAvgAggregateInputType
    _sum?: CareerAnalysisSumAggregateInputType
    _min?: CareerAnalysisMinAggregateInputType
    _max?: CareerAnalysisMaxAggregateInputType
  }

  export type CareerAnalysisGroupByOutputType = {
    id: string
    userId: string
    status: $Enums.CareerAnalysisStatus
    resumeId: string
    roleId: string
    resumeSnapshot: JsonValue
    roleSnapshot: JsonValue
    readinessScore: number | null
    readinessBreakdown: JsonValue | null
    failureReason: string | null
    createdAt: Date
    completedAt: Date | null
    _count: CareerAnalysisCountAggregateOutputType | null
    _avg: CareerAnalysisAvgAggregateOutputType | null
    _sum: CareerAnalysisSumAggregateOutputType | null
    _min: CareerAnalysisMinAggregateOutputType | null
    _max: CareerAnalysisMaxAggregateOutputType | null
  }

  type GetCareerAnalysisGroupByPayload<T extends CareerAnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CareerAnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CareerAnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CareerAnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], CareerAnalysisGroupByOutputType[P]>
        }
      >
    >


  export type CareerAnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    resumeId?: boolean
    roleId?: boolean
    resumeSnapshot?: boolean
    roleSnapshot?: boolean
    readinessScore?: boolean
    readinessBreakdown?: boolean
    failureReason?: boolean
    createdAt?: boolean
    completedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | ResumeDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
    evidence?: boolean | CareerAnalysis$evidenceArgs<ExtArgs>
    gaps?: boolean | CareerAnalysis$gapsArgs<ExtArgs>
    roadmap?: boolean | CareerAnalysis$roadmapArgs<ExtArgs>
    events?: boolean | CareerAnalysis$eventsArgs<ExtArgs>
    _count?: boolean | CareerAnalysisCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["careerAnalysis"]>

  export type CareerAnalysisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    resumeId?: boolean
    roleId?: boolean
    resumeSnapshot?: boolean
    roleSnapshot?: boolean
    readinessScore?: boolean
    readinessBreakdown?: boolean
    failureReason?: boolean
    createdAt?: boolean
    completedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | ResumeDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["careerAnalysis"]>

  export type CareerAnalysisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    resumeId?: boolean
    roleId?: boolean
    resumeSnapshot?: boolean
    roleSnapshot?: boolean
    readinessScore?: boolean
    readinessBreakdown?: boolean
    failureReason?: boolean
    createdAt?: boolean
    completedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | ResumeDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["careerAnalysis"]>

  export type CareerAnalysisSelectScalar = {
    id?: boolean
    userId?: boolean
    status?: boolean
    resumeId?: boolean
    roleId?: boolean
    resumeSnapshot?: boolean
    roleSnapshot?: boolean
    readinessScore?: boolean
    readinessBreakdown?: boolean
    failureReason?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }

  export type CareerAnalysisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "status" | "resumeId" | "roleId" | "resumeSnapshot" | "roleSnapshot" | "readinessScore" | "readinessBreakdown" | "failureReason" | "createdAt" | "completedAt", ExtArgs["result"]["careerAnalysis"]>
  export type CareerAnalysisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | ResumeDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
    evidence?: boolean | CareerAnalysis$evidenceArgs<ExtArgs>
    gaps?: boolean | CareerAnalysis$gapsArgs<ExtArgs>
    roadmap?: boolean | CareerAnalysis$roadmapArgs<ExtArgs>
    events?: boolean | CareerAnalysis$eventsArgs<ExtArgs>
    _count?: boolean | CareerAnalysisCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CareerAnalysisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | ResumeDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type CareerAnalysisIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    resume?: boolean | ResumeDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }

  export type $CareerAnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CareerAnalysis"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      resume: Prisma.$ResumePayload<ExtArgs>
      role: Prisma.$RolePayload<ExtArgs>
      evidence: Prisma.$CandidateSkillEvidencePayload<ExtArgs>[]
      gaps: Prisma.$SkillGapPayload<ExtArgs>[]
      roadmap: Prisma.$RoadmapPayload<ExtArgs> | null
      events: Prisma.$AnalysisEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      status: $Enums.CareerAnalysisStatus
      resumeId: string
      roleId: string
      resumeSnapshot: Prisma.JsonValue
      roleSnapshot: Prisma.JsonValue
      readinessScore: number | null
      readinessBreakdown: Prisma.JsonValue | null
      failureReason: string | null
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["careerAnalysis"]>
    composites: {}
  }

  type CareerAnalysisGetPayload<S extends boolean | null | undefined | CareerAnalysisDefaultArgs> = $Result.GetResult<Prisma.$CareerAnalysisPayload, S>

  type CareerAnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CareerAnalysisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CareerAnalysisCountAggregateInputType | true
    }

  export interface CareerAnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CareerAnalysis'], meta: { name: 'CareerAnalysis' } }
    /**
     * Find zero or one CareerAnalysis that matches the filter.
     * @param {CareerAnalysisFindUniqueArgs} args - Arguments to find a CareerAnalysis
     * @example
     * // Get one CareerAnalysis
     * const careerAnalysis = await prisma.careerAnalysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CareerAnalysisFindUniqueArgs>(args: SelectSubset<T, CareerAnalysisFindUniqueArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CareerAnalysis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CareerAnalysisFindUniqueOrThrowArgs} args - Arguments to find a CareerAnalysis
     * @example
     * // Get one CareerAnalysis
     * const careerAnalysis = await prisma.careerAnalysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CareerAnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, CareerAnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CareerAnalysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerAnalysisFindFirstArgs} args - Arguments to find a CareerAnalysis
     * @example
     * // Get one CareerAnalysis
     * const careerAnalysis = await prisma.careerAnalysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CareerAnalysisFindFirstArgs>(args?: SelectSubset<T, CareerAnalysisFindFirstArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CareerAnalysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerAnalysisFindFirstOrThrowArgs} args - Arguments to find a CareerAnalysis
     * @example
     * // Get one CareerAnalysis
     * const careerAnalysis = await prisma.careerAnalysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CareerAnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, CareerAnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CareerAnalyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerAnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CareerAnalyses
     * const careerAnalyses = await prisma.careerAnalysis.findMany()
     * 
     * // Get first 10 CareerAnalyses
     * const careerAnalyses = await prisma.careerAnalysis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const careerAnalysisWithIdOnly = await prisma.careerAnalysis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CareerAnalysisFindManyArgs>(args?: SelectSubset<T, CareerAnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CareerAnalysis.
     * @param {CareerAnalysisCreateArgs} args - Arguments to create a CareerAnalysis.
     * @example
     * // Create one CareerAnalysis
     * const CareerAnalysis = await prisma.careerAnalysis.create({
     *   data: {
     *     // ... data to create a CareerAnalysis
     *   }
     * })
     * 
     */
    create<T extends CareerAnalysisCreateArgs>(args: SelectSubset<T, CareerAnalysisCreateArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CareerAnalyses.
     * @param {CareerAnalysisCreateManyArgs} args - Arguments to create many CareerAnalyses.
     * @example
     * // Create many CareerAnalyses
     * const careerAnalysis = await prisma.careerAnalysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CareerAnalysisCreateManyArgs>(args?: SelectSubset<T, CareerAnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CareerAnalyses and returns the data saved in the database.
     * @param {CareerAnalysisCreateManyAndReturnArgs} args - Arguments to create many CareerAnalyses.
     * @example
     * // Create many CareerAnalyses
     * const careerAnalysis = await prisma.careerAnalysis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CareerAnalyses and only return the `id`
     * const careerAnalysisWithIdOnly = await prisma.careerAnalysis.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CareerAnalysisCreateManyAndReturnArgs>(args?: SelectSubset<T, CareerAnalysisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CareerAnalysis.
     * @param {CareerAnalysisDeleteArgs} args - Arguments to delete one CareerAnalysis.
     * @example
     * // Delete one CareerAnalysis
     * const CareerAnalysis = await prisma.careerAnalysis.delete({
     *   where: {
     *     // ... filter to delete one CareerAnalysis
     *   }
     * })
     * 
     */
    delete<T extends CareerAnalysisDeleteArgs>(args: SelectSubset<T, CareerAnalysisDeleteArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CareerAnalysis.
     * @param {CareerAnalysisUpdateArgs} args - Arguments to update one CareerAnalysis.
     * @example
     * // Update one CareerAnalysis
     * const careerAnalysis = await prisma.careerAnalysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CareerAnalysisUpdateArgs>(args: SelectSubset<T, CareerAnalysisUpdateArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CareerAnalyses.
     * @param {CareerAnalysisDeleteManyArgs} args - Arguments to filter CareerAnalyses to delete.
     * @example
     * // Delete a few CareerAnalyses
     * const { count } = await prisma.careerAnalysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CareerAnalysisDeleteManyArgs>(args?: SelectSubset<T, CareerAnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CareerAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerAnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CareerAnalyses
     * const careerAnalysis = await prisma.careerAnalysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CareerAnalysisUpdateManyArgs>(args: SelectSubset<T, CareerAnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CareerAnalyses and returns the data updated in the database.
     * @param {CareerAnalysisUpdateManyAndReturnArgs} args - Arguments to update many CareerAnalyses.
     * @example
     * // Update many CareerAnalyses
     * const careerAnalysis = await prisma.careerAnalysis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CareerAnalyses and only return the `id`
     * const careerAnalysisWithIdOnly = await prisma.careerAnalysis.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CareerAnalysisUpdateManyAndReturnArgs>(args: SelectSubset<T, CareerAnalysisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CareerAnalysis.
     * @param {CareerAnalysisUpsertArgs} args - Arguments to update or create a CareerAnalysis.
     * @example
     * // Update or create a CareerAnalysis
     * const careerAnalysis = await prisma.careerAnalysis.upsert({
     *   create: {
     *     // ... data to create a CareerAnalysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CareerAnalysis we want to update
     *   }
     * })
     */
    upsert<T extends CareerAnalysisUpsertArgs>(args: SelectSubset<T, CareerAnalysisUpsertArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CareerAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerAnalysisCountArgs} args - Arguments to filter CareerAnalyses to count.
     * @example
     * // Count the number of CareerAnalyses
     * const count = await prisma.careerAnalysis.count({
     *   where: {
     *     // ... the filter for the CareerAnalyses we want to count
     *   }
     * })
    **/
    count<T extends CareerAnalysisCountArgs>(
      args?: Subset<T, CareerAnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CareerAnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CareerAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerAnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CareerAnalysisAggregateArgs>(args: Subset<T, CareerAnalysisAggregateArgs>): Prisma.PrismaPromise<GetCareerAnalysisAggregateType<T>>

    /**
     * Group by CareerAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CareerAnalysisGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CareerAnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CareerAnalysisGroupByArgs['orderBy'] }
        : { orderBy?: CareerAnalysisGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CareerAnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCareerAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CareerAnalysis model
   */
  readonly fields: CareerAnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CareerAnalysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CareerAnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    resume<T extends ResumeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ResumeDefaultArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    evidence<T extends CareerAnalysis$evidenceArgs<ExtArgs> = {}>(args?: Subset<T, CareerAnalysis$evidenceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gaps<T extends CareerAnalysis$gapsArgs<ExtArgs> = {}>(args?: Subset<T, CareerAnalysis$gapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    roadmap<T extends CareerAnalysis$roadmapArgs<ExtArgs> = {}>(args?: Subset<T, CareerAnalysis$roadmapArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    events<T extends CareerAnalysis$eventsArgs<ExtArgs> = {}>(args?: Subset<T, CareerAnalysis$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CareerAnalysis model
   */
  interface CareerAnalysisFieldRefs {
    readonly id: FieldRef<"CareerAnalysis", 'String'>
    readonly userId: FieldRef<"CareerAnalysis", 'String'>
    readonly status: FieldRef<"CareerAnalysis", 'CareerAnalysisStatus'>
    readonly resumeId: FieldRef<"CareerAnalysis", 'String'>
    readonly roleId: FieldRef<"CareerAnalysis", 'String'>
    readonly resumeSnapshot: FieldRef<"CareerAnalysis", 'Json'>
    readonly roleSnapshot: FieldRef<"CareerAnalysis", 'Json'>
    readonly readinessScore: FieldRef<"CareerAnalysis", 'Int'>
    readonly readinessBreakdown: FieldRef<"CareerAnalysis", 'Json'>
    readonly failureReason: FieldRef<"CareerAnalysis", 'String'>
    readonly createdAt: FieldRef<"CareerAnalysis", 'DateTime'>
    readonly completedAt: FieldRef<"CareerAnalysis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CareerAnalysis findUnique
   */
  export type CareerAnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which CareerAnalysis to fetch.
     */
    where: CareerAnalysisWhereUniqueInput
  }

  /**
   * CareerAnalysis findUniqueOrThrow
   */
  export type CareerAnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which CareerAnalysis to fetch.
     */
    where: CareerAnalysisWhereUniqueInput
  }

  /**
   * CareerAnalysis findFirst
   */
  export type CareerAnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which CareerAnalysis to fetch.
     */
    where?: CareerAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareerAnalyses to fetch.
     */
    orderBy?: CareerAnalysisOrderByWithRelationInput | CareerAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CareerAnalyses.
     */
    cursor?: CareerAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareerAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareerAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CareerAnalyses.
     */
    distinct?: CareerAnalysisScalarFieldEnum | CareerAnalysisScalarFieldEnum[]
  }

  /**
   * CareerAnalysis findFirstOrThrow
   */
  export type CareerAnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which CareerAnalysis to fetch.
     */
    where?: CareerAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareerAnalyses to fetch.
     */
    orderBy?: CareerAnalysisOrderByWithRelationInput | CareerAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CareerAnalyses.
     */
    cursor?: CareerAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareerAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareerAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CareerAnalyses.
     */
    distinct?: CareerAnalysisScalarFieldEnum | CareerAnalysisScalarFieldEnum[]
  }

  /**
   * CareerAnalysis findMany
   */
  export type CareerAnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which CareerAnalyses to fetch.
     */
    where?: CareerAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CareerAnalyses to fetch.
     */
    orderBy?: CareerAnalysisOrderByWithRelationInput | CareerAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CareerAnalyses.
     */
    cursor?: CareerAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CareerAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CareerAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CareerAnalyses.
     */
    distinct?: CareerAnalysisScalarFieldEnum | CareerAnalysisScalarFieldEnum[]
  }

  /**
   * CareerAnalysis create
   */
  export type CareerAnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to create a CareerAnalysis.
     */
    data: XOR<CareerAnalysisCreateInput, CareerAnalysisUncheckedCreateInput>
  }

  /**
   * CareerAnalysis createMany
   */
  export type CareerAnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CareerAnalyses.
     */
    data: CareerAnalysisCreateManyInput | CareerAnalysisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CareerAnalysis createManyAndReturn
   */
  export type CareerAnalysisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * The data used to create many CareerAnalyses.
     */
    data: CareerAnalysisCreateManyInput | CareerAnalysisCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CareerAnalysis update
   */
  export type CareerAnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to update a CareerAnalysis.
     */
    data: XOR<CareerAnalysisUpdateInput, CareerAnalysisUncheckedUpdateInput>
    /**
     * Choose, which CareerAnalysis to update.
     */
    where: CareerAnalysisWhereUniqueInput
  }

  /**
   * CareerAnalysis updateMany
   */
  export type CareerAnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CareerAnalyses.
     */
    data: XOR<CareerAnalysisUpdateManyMutationInput, CareerAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which CareerAnalyses to update
     */
    where?: CareerAnalysisWhereInput
    /**
     * Limit how many CareerAnalyses to update.
     */
    limit?: number
  }

  /**
   * CareerAnalysis updateManyAndReturn
   */
  export type CareerAnalysisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * The data used to update CareerAnalyses.
     */
    data: XOR<CareerAnalysisUpdateManyMutationInput, CareerAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which CareerAnalyses to update
     */
    where?: CareerAnalysisWhereInput
    /**
     * Limit how many CareerAnalyses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CareerAnalysis upsert
   */
  export type CareerAnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    /**
     * The filter to search for the CareerAnalysis to update in case it exists.
     */
    where: CareerAnalysisWhereUniqueInput
    /**
     * In case the CareerAnalysis found by the `where` argument doesn't exist, create a new CareerAnalysis with this data.
     */
    create: XOR<CareerAnalysisCreateInput, CareerAnalysisUncheckedCreateInput>
    /**
     * In case the CareerAnalysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CareerAnalysisUpdateInput, CareerAnalysisUncheckedUpdateInput>
  }

  /**
   * CareerAnalysis delete
   */
  export type CareerAnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
    /**
     * Filter which CareerAnalysis to delete.
     */
    where: CareerAnalysisWhereUniqueInput
  }

  /**
   * CareerAnalysis deleteMany
   */
  export type CareerAnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CareerAnalyses to delete
     */
    where?: CareerAnalysisWhereInput
    /**
     * Limit how many CareerAnalyses to delete.
     */
    limit?: number
  }

  /**
   * CareerAnalysis.evidence
   */
  export type CareerAnalysis$evidenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    where?: CandidateSkillEvidenceWhereInput
    orderBy?: CandidateSkillEvidenceOrderByWithRelationInput | CandidateSkillEvidenceOrderByWithRelationInput[]
    cursor?: CandidateSkillEvidenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CandidateSkillEvidenceScalarFieldEnum | CandidateSkillEvidenceScalarFieldEnum[]
  }

  /**
   * CareerAnalysis.gaps
   */
  export type CareerAnalysis$gapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    where?: SkillGapWhereInput
    orderBy?: SkillGapOrderByWithRelationInput | SkillGapOrderByWithRelationInput[]
    cursor?: SkillGapWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SkillGapScalarFieldEnum | SkillGapScalarFieldEnum[]
  }

  /**
   * CareerAnalysis.roadmap
   */
  export type CareerAnalysis$roadmapArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    where?: RoadmapWhereInput
  }

  /**
   * CareerAnalysis.events
   */
  export type CareerAnalysis$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
    where?: AnalysisEventWhereInput
    orderBy?: AnalysisEventOrderByWithRelationInput | AnalysisEventOrderByWithRelationInput[]
    cursor?: AnalysisEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalysisEventScalarFieldEnum | AnalysisEventScalarFieldEnum[]
  }

  /**
   * CareerAnalysis without action
   */
  export type CareerAnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CareerAnalysis
     */
    select?: CareerAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CareerAnalysis
     */
    omit?: CareerAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CareerAnalysisInclude<ExtArgs> | null
  }


  /**
   * Model CandidateSkillEvidence
   */

  export type AggregateCandidateSkillEvidence = {
    _count: CandidateSkillEvidenceCountAggregateOutputType | null
    _min: CandidateSkillEvidenceMinAggregateOutputType | null
    _max: CandidateSkillEvidenceMaxAggregateOutputType | null
  }

  export type CandidateSkillEvidenceMinAggregateOutputType = {
    id: string | null
    careerAnalysisId: string | null
    skillId: string | null
    strength: $Enums.EvidenceStrength | null
    quote: string | null
    sourceSection: string | null
    sourceLabel: string | null
    createdAt: Date | null
  }

  export type CandidateSkillEvidenceMaxAggregateOutputType = {
    id: string | null
    careerAnalysisId: string | null
    skillId: string | null
    strength: $Enums.EvidenceStrength | null
    quote: string | null
    sourceSection: string | null
    sourceLabel: string | null
    createdAt: Date | null
  }

  export type CandidateSkillEvidenceCountAggregateOutputType = {
    id: number
    careerAnalysisId: number
    skillId: number
    strength: number
    quote: number
    sourceSection: number
    sourceLabel: number
    createdAt: number
    _all: number
  }


  export type CandidateSkillEvidenceMinAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    skillId?: true
    strength?: true
    quote?: true
    sourceSection?: true
    sourceLabel?: true
    createdAt?: true
  }

  export type CandidateSkillEvidenceMaxAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    skillId?: true
    strength?: true
    quote?: true
    sourceSection?: true
    sourceLabel?: true
    createdAt?: true
  }

  export type CandidateSkillEvidenceCountAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    skillId?: true
    strength?: true
    quote?: true
    sourceSection?: true
    sourceLabel?: true
    createdAt?: true
    _all?: true
  }

  export type CandidateSkillEvidenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CandidateSkillEvidence to aggregate.
     */
    where?: CandidateSkillEvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CandidateSkillEvidences to fetch.
     */
    orderBy?: CandidateSkillEvidenceOrderByWithRelationInput | CandidateSkillEvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CandidateSkillEvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CandidateSkillEvidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CandidateSkillEvidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CandidateSkillEvidences
    **/
    _count?: true | CandidateSkillEvidenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CandidateSkillEvidenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CandidateSkillEvidenceMaxAggregateInputType
  }

  export type GetCandidateSkillEvidenceAggregateType<T extends CandidateSkillEvidenceAggregateArgs> = {
        [P in keyof T & keyof AggregateCandidateSkillEvidence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCandidateSkillEvidence[P]>
      : GetScalarType<T[P], AggregateCandidateSkillEvidence[P]>
  }




  export type CandidateSkillEvidenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CandidateSkillEvidenceWhereInput
    orderBy?: CandidateSkillEvidenceOrderByWithAggregationInput | CandidateSkillEvidenceOrderByWithAggregationInput[]
    by: CandidateSkillEvidenceScalarFieldEnum[] | CandidateSkillEvidenceScalarFieldEnum
    having?: CandidateSkillEvidenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CandidateSkillEvidenceCountAggregateInputType | true
    _min?: CandidateSkillEvidenceMinAggregateInputType
    _max?: CandidateSkillEvidenceMaxAggregateInputType
  }

  export type CandidateSkillEvidenceGroupByOutputType = {
    id: string
    careerAnalysisId: string
    skillId: string
    strength: $Enums.EvidenceStrength
    quote: string
    sourceSection: string
    sourceLabel: string
    createdAt: Date
    _count: CandidateSkillEvidenceCountAggregateOutputType | null
    _min: CandidateSkillEvidenceMinAggregateOutputType | null
    _max: CandidateSkillEvidenceMaxAggregateOutputType | null
  }

  type GetCandidateSkillEvidenceGroupByPayload<T extends CandidateSkillEvidenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CandidateSkillEvidenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CandidateSkillEvidenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CandidateSkillEvidenceGroupByOutputType[P]>
            : GetScalarType<T[P], CandidateSkillEvidenceGroupByOutputType[P]>
        }
      >
    >


  export type CandidateSkillEvidenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    skillId?: boolean
    strength?: boolean
    quote?: boolean
    sourceSection?: boolean
    sourceLabel?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["candidateSkillEvidence"]>

  export type CandidateSkillEvidenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    skillId?: boolean
    strength?: boolean
    quote?: boolean
    sourceSection?: boolean
    sourceLabel?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["candidateSkillEvidence"]>

  export type CandidateSkillEvidenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    skillId?: boolean
    strength?: boolean
    quote?: boolean
    sourceSection?: boolean
    sourceLabel?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["candidateSkillEvidence"]>

  export type CandidateSkillEvidenceSelectScalar = {
    id?: boolean
    careerAnalysisId?: boolean
    skillId?: boolean
    strength?: boolean
    quote?: boolean
    sourceSection?: boolean
    sourceLabel?: boolean
    createdAt?: boolean
  }

  export type CandidateSkillEvidenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "careerAnalysisId" | "skillId" | "strength" | "quote" | "sourceSection" | "sourceLabel" | "createdAt", ExtArgs["result"]["candidateSkillEvidence"]>
  export type CandidateSkillEvidenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }
  export type CandidateSkillEvidenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }
  export type CandidateSkillEvidenceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }

  export type $CandidateSkillEvidencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CandidateSkillEvidence"
    objects: {
      careerAnalysis: Prisma.$CareerAnalysisPayload<ExtArgs>
      skill: Prisma.$SkillPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      careerAnalysisId: string
      skillId: string
      strength: $Enums.EvidenceStrength
      quote: string
      sourceSection: string
      sourceLabel: string
      createdAt: Date
    }, ExtArgs["result"]["candidateSkillEvidence"]>
    composites: {}
  }

  type CandidateSkillEvidenceGetPayload<S extends boolean | null | undefined | CandidateSkillEvidenceDefaultArgs> = $Result.GetResult<Prisma.$CandidateSkillEvidencePayload, S>

  type CandidateSkillEvidenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CandidateSkillEvidenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CandidateSkillEvidenceCountAggregateInputType | true
    }

  export interface CandidateSkillEvidenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CandidateSkillEvidence'], meta: { name: 'CandidateSkillEvidence' } }
    /**
     * Find zero or one CandidateSkillEvidence that matches the filter.
     * @param {CandidateSkillEvidenceFindUniqueArgs} args - Arguments to find a CandidateSkillEvidence
     * @example
     * // Get one CandidateSkillEvidence
     * const candidateSkillEvidence = await prisma.candidateSkillEvidence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CandidateSkillEvidenceFindUniqueArgs>(args: SelectSubset<T, CandidateSkillEvidenceFindUniqueArgs<ExtArgs>>): Prisma__CandidateSkillEvidenceClient<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CandidateSkillEvidence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CandidateSkillEvidenceFindUniqueOrThrowArgs} args - Arguments to find a CandidateSkillEvidence
     * @example
     * // Get one CandidateSkillEvidence
     * const candidateSkillEvidence = await prisma.candidateSkillEvidence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CandidateSkillEvidenceFindUniqueOrThrowArgs>(args: SelectSubset<T, CandidateSkillEvidenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CandidateSkillEvidenceClient<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CandidateSkillEvidence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidateSkillEvidenceFindFirstArgs} args - Arguments to find a CandidateSkillEvidence
     * @example
     * // Get one CandidateSkillEvidence
     * const candidateSkillEvidence = await prisma.candidateSkillEvidence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CandidateSkillEvidenceFindFirstArgs>(args?: SelectSubset<T, CandidateSkillEvidenceFindFirstArgs<ExtArgs>>): Prisma__CandidateSkillEvidenceClient<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CandidateSkillEvidence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidateSkillEvidenceFindFirstOrThrowArgs} args - Arguments to find a CandidateSkillEvidence
     * @example
     * // Get one CandidateSkillEvidence
     * const candidateSkillEvidence = await prisma.candidateSkillEvidence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CandidateSkillEvidenceFindFirstOrThrowArgs>(args?: SelectSubset<T, CandidateSkillEvidenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__CandidateSkillEvidenceClient<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CandidateSkillEvidences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidateSkillEvidenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CandidateSkillEvidences
     * const candidateSkillEvidences = await prisma.candidateSkillEvidence.findMany()
     * 
     * // Get first 10 CandidateSkillEvidences
     * const candidateSkillEvidences = await prisma.candidateSkillEvidence.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const candidateSkillEvidenceWithIdOnly = await prisma.candidateSkillEvidence.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CandidateSkillEvidenceFindManyArgs>(args?: SelectSubset<T, CandidateSkillEvidenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CandidateSkillEvidence.
     * @param {CandidateSkillEvidenceCreateArgs} args - Arguments to create a CandidateSkillEvidence.
     * @example
     * // Create one CandidateSkillEvidence
     * const CandidateSkillEvidence = await prisma.candidateSkillEvidence.create({
     *   data: {
     *     // ... data to create a CandidateSkillEvidence
     *   }
     * })
     * 
     */
    create<T extends CandidateSkillEvidenceCreateArgs>(args: SelectSubset<T, CandidateSkillEvidenceCreateArgs<ExtArgs>>): Prisma__CandidateSkillEvidenceClient<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CandidateSkillEvidences.
     * @param {CandidateSkillEvidenceCreateManyArgs} args - Arguments to create many CandidateSkillEvidences.
     * @example
     * // Create many CandidateSkillEvidences
     * const candidateSkillEvidence = await prisma.candidateSkillEvidence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CandidateSkillEvidenceCreateManyArgs>(args?: SelectSubset<T, CandidateSkillEvidenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CandidateSkillEvidences and returns the data saved in the database.
     * @param {CandidateSkillEvidenceCreateManyAndReturnArgs} args - Arguments to create many CandidateSkillEvidences.
     * @example
     * // Create many CandidateSkillEvidences
     * const candidateSkillEvidence = await prisma.candidateSkillEvidence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CandidateSkillEvidences and only return the `id`
     * const candidateSkillEvidenceWithIdOnly = await prisma.candidateSkillEvidence.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CandidateSkillEvidenceCreateManyAndReturnArgs>(args?: SelectSubset<T, CandidateSkillEvidenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CandidateSkillEvidence.
     * @param {CandidateSkillEvidenceDeleteArgs} args - Arguments to delete one CandidateSkillEvidence.
     * @example
     * // Delete one CandidateSkillEvidence
     * const CandidateSkillEvidence = await prisma.candidateSkillEvidence.delete({
     *   where: {
     *     // ... filter to delete one CandidateSkillEvidence
     *   }
     * })
     * 
     */
    delete<T extends CandidateSkillEvidenceDeleteArgs>(args: SelectSubset<T, CandidateSkillEvidenceDeleteArgs<ExtArgs>>): Prisma__CandidateSkillEvidenceClient<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CandidateSkillEvidence.
     * @param {CandidateSkillEvidenceUpdateArgs} args - Arguments to update one CandidateSkillEvidence.
     * @example
     * // Update one CandidateSkillEvidence
     * const candidateSkillEvidence = await prisma.candidateSkillEvidence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CandidateSkillEvidenceUpdateArgs>(args: SelectSubset<T, CandidateSkillEvidenceUpdateArgs<ExtArgs>>): Prisma__CandidateSkillEvidenceClient<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CandidateSkillEvidences.
     * @param {CandidateSkillEvidenceDeleteManyArgs} args - Arguments to filter CandidateSkillEvidences to delete.
     * @example
     * // Delete a few CandidateSkillEvidences
     * const { count } = await prisma.candidateSkillEvidence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CandidateSkillEvidenceDeleteManyArgs>(args?: SelectSubset<T, CandidateSkillEvidenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CandidateSkillEvidences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidateSkillEvidenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CandidateSkillEvidences
     * const candidateSkillEvidence = await prisma.candidateSkillEvidence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CandidateSkillEvidenceUpdateManyArgs>(args: SelectSubset<T, CandidateSkillEvidenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CandidateSkillEvidences and returns the data updated in the database.
     * @param {CandidateSkillEvidenceUpdateManyAndReturnArgs} args - Arguments to update many CandidateSkillEvidences.
     * @example
     * // Update many CandidateSkillEvidences
     * const candidateSkillEvidence = await prisma.candidateSkillEvidence.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CandidateSkillEvidences and only return the `id`
     * const candidateSkillEvidenceWithIdOnly = await prisma.candidateSkillEvidence.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CandidateSkillEvidenceUpdateManyAndReturnArgs>(args: SelectSubset<T, CandidateSkillEvidenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CandidateSkillEvidence.
     * @param {CandidateSkillEvidenceUpsertArgs} args - Arguments to update or create a CandidateSkillEvidence.
     * @example
     * // Update or create a CandidateSkillEvidence
     * const candidateSkillEvidence = await prisma.candidateSkillEvidence.upsert({
     *   create: {
     *     // ... data to create a CandidateSkillEvidence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CandidateSkillEvidence we want to update
     *   }
     * })
     */
    upsert<T extends CandidateSkillEvidenceUpsertArgs>(args: SelectSubset<T, CandidateSkillEvidenceUpsertArgs<ExtArgs>>): Prisma__CandidateSkillEvidenceClient<$Result.GetResult<Prisma.$CandidateSkillEvidencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CandidateSkillEvidences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidateSkillEvidenceCountArgs} args - Arguments to filter CandidateSkillEvidences to count.
     * @example
     * // Count the number of CandidateSkillEvidences
     * const count = await prisma.candidateSkillEvidence.count({
     *   where: {
     *     // ... the filter for the CandidateSkillEvidences we want to count
     *   }
     * })
    **/
    count<T extends CandidateSkillEvidenceCountArgs>(
      args?: Subset<T, CandidateSkillEvidenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CandidateSkillEvidenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CandidateSkillEvidence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidateSkillEvidenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CandidateSkillEvidenceAggregateArgs>(args: Subset<T, CandidateSkillEvidenceAggregateArgs>): Prisma.PrismaPromise<GetCandidateSkillEvidenceAggregateType<T>>

    /**
     * Group by CandidateSkillEvidence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CandidateSkillEvidenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CandidateSkillEvidenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CandidateSkillEvidenceGroupByArgs['orderBy'] }
        : { orderBy?: CandidateSkillEvidenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CandidateSkillEvidenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCandidateSkillEvidenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CandidateSkillEvidence model
   */
  readonly fields: CandidateSkillEvidenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CandidateSkillEvidence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CandidateSkillEvidenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    careerAnalysis<T extends CareerAnalysisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CareerAnalysisDefaultArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    skill<T extends SkillDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SkillDefaultArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CandidateSkillEvidence model
   */
  interface CandidateSkillEvidenceFieldRefs {
    readonly id: FieldRef<"CandidateSkillEvidence", 'String'>
    readonly careerAnalysisId: FieldRef<"CandidateSkillEvidence", 'String'>
    readonly skillId: FieldRef<"CandidateSkillEvidence", 'String'>
    readonly strength: FieldRef<"CandidateSkillEvidence", 'EvidenceStrength'>
    readonly quote: FieldRef<"CandidateSkillEvidence", 'String'>
    readonly sourceSection: FieldRef<"CandidateSkillEvidence", 'String'>
    readonly sourceLabel: FieldRef<"CandidateSkillEvidence", 'String'>
    readonly createdAt: FieldRef<"CandidateSkillEvidence", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CandidateSkillEvidence findUnique
   */
  export type CandidateSkillEvidenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    /**
     * Filter, which CandidateSkillEvidence to fetch.
     */
    where: CandidateSkillEvidenceWhereUniqueInput
  }

  /**
   * CandidateSkillEvidence findUniqueOrThrow
   */
  export type CandidateSkillEvidenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    /**
     * Filter, which CandidateSkillEvidence to fetch.
     */
    where: CandidateSkillEvidenceWhereUniqueInput
  }

  /**
   * CandidateSkillEvidence findFirst
   */
  export type CandidateSkillEvidenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    /**
     * Filter, which CandidateSkillEvidence to fetch.
     */
    where?: CandidateSkillEvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CandidateSkillEvidences to fetch.
     */
    orderBy?: CandidateSkillEvidenceOrderByWithRelationInput | CandidateSkillEvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CandidateSkillEvidences.
     */
    cursor?: CandidateSkillEvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CandidateSkillEvidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CandidateSkillEvidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CandidateSkillEvidences.
     */
    distinct?: CandidateSkillEvidenceScalarFieldEnum | CandidateSkillEvidenceScalarFieldEnum[]
  }

  /**
   * CandidateSkillEvidence findFirstOrThrow
   */
  export type CandidateSkillEvidenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    /**
     * Filter, which CandidateSkillEvidence to fetch.
     */
    where?: CandidateSkillEvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CandidateSkillEvidences to fetch.
     */
    orderBy?: CandidateSkillEvidenceOrderByWithRelationInput | CandidateSkillEvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CandidateSkillEvidences.
     */
    cursor?: CandidateSkillEvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CandidateSkillEvidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CandidateSkillEvidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CandidateSkillEvidences.
     */
    distinct?: CandidateSkillEvidenceScalarFieldEnum | CandidateSkillEvidenceScalarFieldEnum[]
  }

  /**
   * CandidateSkillEvidence findMany
   */
  export type CandidateSkillEvidenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    /**
     * Filter, which CandidateSkillEvidences to fetch.
     */
    where?: CandidateSkillEvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CandidateSkillEvidences to fetch.
     */
    orderBy?: CandidateSkillEvidenceOrderByWithRelationInput | CandidateSkillEvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CandidateSkillEvidences.
     */
    cursor?: CandidateSkillEvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CandidateSkillEvidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CandidateSkillEvidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CandidateSkillEvidences.
     */
    distinct?: CandidateSkillEvidenceScalarFieldEnum | CandidateSkillEvidenceScalarFieldEnum[]
  }

  /**
   * CandidateSkillEvidence create
   */
  export type CandidateSkillEvidenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    /**
     * The data needed to create a CandidateSkillEvidence.
     */
    data: XOR<CandidateSkillEvidenceCreateInput, CandidateSkillEvidenceUncheckedCreateInput>
  }

  /**
   * CandidateSkillEvidence createMany
   */
  export type CandidateSkillEvidenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CandidateSkillEvidences.
     */
    data: CandidateSkillEvidenceCreateManyInput | CandidateSkillEvidenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CandidateSkillEvidence createManyAndReturn
   */
  export type CandidateSkillEvidenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * The data used to create many CandidateSkillEvidences.
     */
    data: CandidateSkillEvidenceCreateManyInput | CandidateSkillEvidenceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CandidateSkillEvidence update
   */
  export type CandidateSkillEvidenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    /**
     * The data needed to update a CandidateSkillEvidence.
     */
    data: XOR<CandidateSkillEvidenceUpdateInput, CandidateSkillEvidenceUncheckedUpdateInput>
    /**
     * Choose, which CandidateSkillEvidence to update.
     */
    where: CandidateSkillEvidenceWhereUniqueInput
  }

  /**
   * CandidateSkillEvidence updateMany
   */
  export type CandidateSkillEvidenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CandidateSkillEvidences.
     */
    data: XOR<CandidateSkillEvidenceUpdateManyMutationInput, CandidateSkillEvidenceUncheckedUpdateManyInput>
    /**
     * Filter which CandidateSkillEvidences to update
     */
    where?: CandidateSkillEvidenceWhereInput
    /**
     * Limit how many CandidateSkillEvidences to update.
     */
    limit?: number
  }

  /**
   * CandidateSkillEvidence updateManyAndReturn
   */
  export type CandidateSkillEvidenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * The data used to update CandidateSkillEvidences.
     */
    data: XOR<CandidateSkillEvidenceUpdateManyMutationInput, CandidateSkillEvidenceUncheckedUpdateManyInput>
    /**
     * Filter which CandidateSkillEvidences to update
     */
    where?: CandidateSkillEvidenceWhereInput
    /**
     * Limit how many CandidateSkillEvidences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CandidateSkillEvidence upsert
   */
  export type CandidateSkillEvidenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    /**
     * The filter to search for the CandidateSkillEvidence to update in case it exists.
     */
    where: CandidateSkillEvidenceWhereUniqueInput
    /**
     * In case the CandidateSkillEvidence found by the `where` argument doesn't exist, create a new CandidateSkillEvidence with this data.
     */
    create: XOR<CandidateSkillEvidenceCreateInput, CandidateSkillEvidenceUncheckedCreateInput>
    /**
     * In case the CandidateSkillEvidence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CandidateSkillEvidenceUpdateInput, CandidateSkillEvidenceUncheckedUpdateInput>
  }

  /**
   * CandidateSkillEvidence delete
   */
  export type CandidateSkillEvidenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
    /**
     * Filter which CandidateSkillEvidence to delete.
     */
    where: CandidateSkillEvidenceWhereUniqueInput
  }

  /**
   * CandidateSkillEvidence deleteMany
   */
  export type CandidateSkillEvidenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CandidateSkillEvidences to delete
     */
    where?: CandidateSkillEvidenceWhereInput
    /**
     * Limit how many CandidateSkillEvidences to delete.
     */
    limit?: number
  }

  /**
   * CandidateSkillEvidence without action
   */
  export type CandidateSkillEvidenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CandidateSkillEvidence
     */
    select?: CandidateSkillEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CandidateSkillEvidence
     */
    omit?: CandidateSkillEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CandidateSkillEvidenceInclude<ExtArgs> | null
  }


  /**
   * Model SkillGap
   */

  export type AggregateSkillGap = {
    _count: SkillGapCountAggregateOutputType | null
    _avg: SkillGapAvgAggregateOutputType | null
    _sum: SkillGapSumAggregateOutputType | null
    _min: SkillGapMinAggregateOutputType | null
    _max: SkillGapMaxAggregateOutputType | null
  }

  export type SkillGapAvgAggregateOutputType = {
    priority: number | null
  }

  export type SkillGapSumAggregateOutputType = {
    priority: number | null
  }

  export type SkillGapMinAggregateOutputType = {
    id: string | null
    careerAnalysisId: string | null
    skillId: string | null
    status: $Enums.GapStatus | null
    priority: number | null
    reasoning: string | null
    createdAt: Date | null
  }

  export type SkillGapMaxAggregateOutputType = {
    id: string | null
    careerAnalysisId: string | null
    skillId: string | null
    status: $Enums.GapStatus | null
    priority: number | null
    reasoning: string | null
    createdAt: Date | null
  }

  export type SkillGapCountAggregateOutputType = {
    id: number
    careerAnalysisId: number
    skillId: number
    status: number
    priority: number
    reasoning: number
    createdAt: number
    _all: number
  }


  export type SkillGapAvgAggregateInputType = {
    priority?: true
  }

  export type SkillGapSumAggregateInputType = {
    priority?: true
  }

  export type SkillGapMinAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    skillId?: true
    status?: true
    priority?: true
    reasoning?: true
    createdAt?: true
  }

  export type SkillGapMaxAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    skillId?: true
    status?: true
    priority?: true
    reasoning?: true
    createdAt?: true
  }

  export type SkillGapCountAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    skillId?: true
    status?: true
    priority?: true
    reasoning?: true
    createdAt?: true
    _all?: true
  }

  export type SkillGapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SkillGap to aggregate.
     */
    where?: SkillGapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillGaps to fetch.
     */
    orderBy?: SkillGapOrderByWithRelationInput | SkillGapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SkillGapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillGaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillGaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SkillGaps
    **/
    _count?: true | SkillGapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SkillGapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SkillGapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SkillGapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SkillGapMaxAggregateInputType
  }

  export type GetSkillGapAggregateType<T extends SkillGapAggregateArgs> = {
        [P in keyof T & keyof AggregateSkillGap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSkillGap[P]>
      : GetScalarType<T[P], AggregateSkillGap[P]>
  }




  export type SkillGapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillGapWhereInput
    orderBy?: SkillGapOrderByWithAggregationInput | SkillGapOrderByWithAggregationInput[]
    by: SkillGapScalarFieldEnum[] | SkillGapScalarFieldEnum
    having?: SkillGapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SkillGapCountAggregateInputType | true
    _avg?: SkillGapAvgAggregateInputType
    _sum?: SkillGapSumAggregateInputType
    _min?: SkillGapMinAggregateInputType
    _max?: SkillGapMaxAggregateInputType
  }

  export type SkillGapGroupByOutputType = {
    id: string
    careerAnalysisId: string
    skillId: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt: Date
    _count: SkillGapCountAggregateOutputType | null
    _avg: SkillGapAvgAggregateOutputType | null
    _sum: SkillGapSumAggregateOutputType | null
    _min: SkillGapMinAggregateOutputType | null
    _max: SkillGapMaxAggregateOutputType | null
  }

  type GetSkillGapGroupByPayload<T extends SkillGapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SkillGapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SkillGapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SkillGapGroupByOutputType[P]>
            : GetScalarType<T[P], SkillGapGroupByOutputType[P]>
        }
      >
    >


  export type SkillGapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    skillId?: boolean
    status?: boolean
    priority?: boolean
    reasoning?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
    tasks?: boolean | SkillGap$tasksArgs<ExtArgs>
    _count?: boolean | SkillGapCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skillGap"]>

  export type SkillGapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    skillId?: boolean
    status?: boolean
    priority?: boolean
    reasoning?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skillGap"]>

  export type SkillGapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    skillId?: boolean
    status?: boolean
    priority?: boolean
    reasoning?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skillGap"]>

  export type SkillGapSelectScalar = {
    id?: boolean
    careerAnalysisId?: boolean
    skillId?: boolean
    status?: boolean
    priority?: boolean
    reasoning?: boolean
    createdAt?: boolean
  }

  export type SkillGapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "careerAnalysisId" | "skillId" | "status" | "priority" | "reasoning" | "createdAt", ExtArgs["result"]["skillGap"]>
  export type SkillGapInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
    tasks?: boolean | SkillGap$tasksArgs<ExtArgs>
    _count?: boolean | SkillGapCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SkillGapIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }
  export type SkillGapIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }

  export type $SkillGapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SkillGap"
    objects: {
      careerAnalysis: Prisma.$CareerAnalysisPayload<ExtArgs>
      skill: Prisma.$SkillPayload<ExtArgs>
      tasks: Prisma.$RoadmapTaskPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      careerAnalysisId: string
      skillId: string
      status: $Enums.GapStatus
      priority: number
      reasoning: string
      createdAt: Date
    }, ExtArgs["result"]["skillGap"]>
    composites: {}
  }

  type SkillGapGetPayload<S extends boolean | null | undefined | SkillGapDefaultArgs> = $Result.GetResult<Prisma.$SkillGapPayload, S>

  type SkillGapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SkillGapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SkillGapCountAggregateInputType | true
    }

  export interface SkillGapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SkillGap'], meta: { name: 'SkillGap' } }
    /**
     * Find zero or one SkillGap that matches the filter.
     * @param {SkillGapFindUniqueArgs} args - Arguments to find a SkillGap
     * @example
     * // Get one SkillGap
     * const skillGap = await prisma.skillGap.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SkillGapFindUniqueArgs>(args: SelectSubset<T, SkillGapFindUniqueArgs<ExtArgs>>): Prisma__SkillGapClient<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SkillGap that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SkillGapFindUniqueOrThrowArgs} args - Arguments to find a SkillGap
     * @example
     * // Get one SkillGap
     * const skillGap = await prisma.skillGap.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SkillGapFindUniqueOrThrowArgs>(args: SelectSubset<T, SkillGapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SkillGapClient<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SkillGap that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGapFindFirstArgs} args - Arguments to find a SkillGap
     * @example
     * // Get one SkillGap
     * const skillGap = await prisma.skillGap.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SkillGapFindFirstArgs>(args?: SelectSubset<T, SkillGapFindFirstArgs<ExtArgs>>): Prisma__SkillGapClient<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SkillGap that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGapFindFirstOrThrowArgs} args - Arguments to find a SkillGap
     * @example
     * // Get one SkillGap
     * const skillGap = await prisma.skillGap.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SkillGapFindFirstOrThrowArgs>(args?: SelectSubset<T, SkillGapFindFirstOrThrowArgs<ExtArgs>>): Prisma__SkillGapClient<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SkillGaps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SkillGaps
     * const skillGaps = await prisma.skillGap.findMany()
     * 
     * // Get first 10 SkillGaps
     * const skillGaps = await prisma.skillGap.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const skillGapWithIdOnly = await prisma.skillGap.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SkillGapFindManyArgs>(args?: SelectSubset<T, SkillGapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SkillGap.
     * @param {SkillGapCreateArgs} args - Arguments to create a SkillGap.
     * @example
     * // Create one SkillGap
     * const SkillGap = await prisma.skillGap.create({
     *   data: {
     *     // ... data to create a SkillGap
     *   }
     * })
     * 
     */
    create<T extends SkillGapCreateArgs>(args: SelectSubset<T, SkillGapCreateArgs<ExtArgs>>): Prisma__SkillGapClient<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SkillGaps.
     * @param {SkillGapCreateManyArgs} args - Arguments to create many SkillGaps.
     * @example
     * // Create many SkillGaps
     * const skillGap = await prisma.skillGap.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SkillGapCreateManyArgs>(args?: SelectSubset<T, SkillGapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SkillGaps and returns the data saved in the database.
     * @param {SkillGapCreateManyAndReturnArgs} args - Arguments to create many SkillGaps.
     * @example
     * // Create many SkillGaps
     * const skillGap = await prisma.skillGap.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SkillGaps and only return the `id`
     * const skillGapWithIdOnly = await prisma.skillGap.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SkillGapCreateManyAndReturnArgs>(args?: SelectSubset<T, SkillGapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SkillGap.
     * @param {SkillGapDeleteArgs} args - Arguments to delete one SkillGap.
     * @example
     * // Delete one SkillGap
     * const SkillGap = await prisma.skillGap.delete({
     *   where: {
     *     // ... filter to delete one SkillGap
     *   }
     * })
     * 
     */
    delete<T extends SkillGapDeleteArgs>(args: SelectSubset<T, SkillGapDeleteArgs<ExtArgs>>): Prisma__SkillGapClient<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SkillGap.
     * @param {SkillGapUpdateArgs} args - Arguments to update one SkillGap.
     * @example
     * // Update one SkillGap
     * const skillGap = await prisma.skillGap.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SkillGapUpdateArgs>(args: SelectSubset<T, SkillGapUpdateArgs<ExtArgs>>): Prisma__SkillGapClient<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SkillGaps.
     * @param {SkillGapDeleteManyArgs} args - Arguments to filter SkillGaps to delete.
     * @example
     * // Delete a few SkillGaps
     * const { count } = await prisma.skillGap.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SkillGapDeleteManyArgs>(args?: SelectSubset<T, SkillGapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SkillGaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SkillGaps
     * const skillGap = await prisma.skillGap.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SkillGapUpdateManyArgs>(args: SelectSubset<T, SkillGapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SkillGaps and returns the data updated in the database.
     * @param {SkillGapUpdateManyAndReturnArgs} args - Arguments to update many SkillGaps.
     * @example
     * // Update many SkillGaps
     * const skillGap = await prisma.skillGap.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SkillGaps and only return the `id`
     * const skillGapWithIdOnly = await prisma.skillGap.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SkillGapUpdateManyAndReturnArgs>(args: SelectSubset<T, SkillGapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SkillGap.
     * @param {SkillGapUpsertArgs} args - Arguments to update or create a SkillGap.
     * @example
     * // Update or create a SkillGap
     * const skillGap = await prisma.skillGap.upsert({
     *   create: {
     *     // ... data to create a SkillGap
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SkillGap we want to update
     *   }
     * })
     */
    upsert<T extends SkillGapUpsertArgs>(args: SelectSubset<T, SkillGapUpsertArgs<ExtArgs>>): Prisma__SkillGapClient<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SkillGaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGapCountArgs} args - Arguments to filter SkillGaps to count.
     * @example
     * // Count the number of SkillGaps
     * const count = await prisma.skillGap.count({
     *   where: {
     *     // ... the filter for the SkillGaps we want to count
     *   }
     * })
    **/
    count<T extends SkillGapCountArgs>(
      args?: Subset<T, SkillGapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SkillGapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SkillGap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SkillGapAggregateArgs>(args: Subset<T, SkillGapAggregateArgs>): Prisma.PrismaPromise<GetSkillGapAggregateType<T>>

    /**
     * Group by SkillGap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGapGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SkillGapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SkillGapGroupByArgs['orderBy'] }
        : { orderBy?: SkillGapGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SkillGapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSkillGapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SkillGap model
   */
  readonly fields: SkillGapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SkillGap.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SkillGapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    careerAnalysis<T extends CareerAnalysisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CareerAnalysisDefaultArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    skill<T extends SkillDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SkillDefaultArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tasks<T extends SkillGap$tasksArgs<ExtArgs> = {}>(args?: Subset<T, SkillGap$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SkillGap model
   */
  interface SkillGapFieldRefs {
    readonly id: FieldRef<"SkillGap", 'String'>
    readonly careerAnalysisId: FieldRef<"SkillGap", 'String'>
    readonly skillId: FieldRef<"SkillGap", 'String'>
    readonly status: FieldRef<"SkillGap", 'GapStatus'>
    readonly priority: FieldRef<"SkillGap", 'Int'>
    readonly reasoning: FieldRef<"SkillGap", 'String'>
    readonly createdAt: FieldRef<"SkillGap", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SkillGap findUnique
   */
  export type SkillGapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    /**
     * Filter, which SkillGap to fetch.
     */
    where: SkillGapWhereUniqueInput
  }

  /**
   * SkillGap findUniqueOrThrow
   */
  export type SkillGapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    /**
     * Filter, which SkillGap to fetch.
     */
    where: SkillGapWhereUniqueInput
  }

  /**
   * SkillGap findFirst
   */
  export type SkillGapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    /**
     * Filter, which SkillGap to fetch.
     */
    where?: SkillGapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillGaps to fetch.
     */
    orderBy?: SkillGapOrderByWithRelationInput | SkillGapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SkillGaps.
     */
    cursor?: SkillGapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillGaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillGaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SkillGaps.
     */
    distinct?: SkillGapScalarFieldEnum | SkillGapScalarFieldEnum[]
  }

  /**
   * SkillGap findFirstOrThrow
   */
  export type SkillGapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    /**
     * Filter, which SkillGap to fetch.
     */
    where?: SkillGapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillGaps to fetch.
     */
    orderBy?: SkillGapOrderByWithRelationInput | SkillGapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SkillGaps.
     */
    cursor?: SkillGapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillGaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillGaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SkillGaps.
     */
    distinct?: SkillGapScalarFieldEnum | SkillGapScalarFieldEnum[]
  }

  /**
   * SkillGap findMany
   */
  export type SkillGapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    /**
     * Filter, which SkillGaps to fetch.
     */
    where?: SkillGapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillGaps to fetch.
     */
    orderBy?: SkillGapOrderByWithRelationInput | SkillGapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SkillGaps.
     */
    cursor?: SkillGapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillGaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillGaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SkillGaps.
     */
    distinct?: SkillGapScalarFieldEnum | SkillGapScalarFieldEnum[]
  }

  /**
   * SkillGap create
   */
  export type SkillGapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    /**
     * The data needed to create a SkillGap.
     */
    data: XOR<SkillGapCreateInput, SkillGapUncheckedCreateInput>
  }

  /**
   * SkillGap createMany
   */
  export type SkillGapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SkillGaps.
     */
    data: SkillGapCreateManyInput | SkillGapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SkillGap createManyAndReturn
   */
  export type SkillGapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * The data used to create many SkillGaps.
     */
    data: SkillGapCreateManyInput | SkillGapCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SkillGap update
   */
  export type SkillGapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    /**
     * The data needed to update a SkillGap.
     */
    data: XOR<SkillGapUpdateInput, SkillGapUncheckedUpdateInput>
    /**
     * Choose, which SkillGap to update.
     */
    where: SkillGapWhereUniqueInput
  }

  /**
   * SkillGap updateMany
   */
  export type SkillGapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SkillGaps.
     */
    data: XOR<SkillGapUpdateManyMutationInput, SkillGapUncheckedUpdateManyInput>
    /**
     * Filter which SkillGaps to update
     */
    where?: SkillGapWhereInput
    /**
     * Limit how many SkillGaps to update.
     */
    limit?: number
  }

  /**
   * SkillGap updateManyAndReturn
   */
  export type SkillGapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * The data used to update SkillGaps.
     */
    data: XOR<SkillGapUpdateManyMutationInput, SkillGapUncheckedUpdateManyInput>
    /**
     * Filter which SkillGaps to update
     */
    where?: SkillGapWhereInput
    /**
     * Limit how many SkillGaps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SkillGap upsert
   */
  export type SkillGapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    /**
     * The filter to search for the SkillGap to update in case it exists.
     */
    where: SkillGapWhereUniqueInput
    /**
     * In case the SkillGap found by the `where` argument doesn't exist, create a new SkillGap with this data.
     */
    create: XOR<SkillGapCreateInput, SkillGapUncheckedCreateInput>
    /**
     * In case the SkillGap was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SkillGapUpdateInput, SkillGapUncheckedUpdateInput>
  }

  /**
   * SkillGap delete
   */
  export type SkillGapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    /**
     * Filter which SkillGap to delete.
     */
    where: SkillGapWhereUniqueInput
  }

  /**
   * SkillGap deleteMany
   */
  export type SkillGapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SkillGaps to delete
     */
    where?: SkillGapWhereInput
    /**
     * Limit how many SkillGaps to delete.
     */
    limit?: number
  }

  /**
   * SkillGap.tasks
   */
  export type SkillGap$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    where?: RoadmapTaskWhereInput
    orderBy?: RoadmapTaskOrderByWithRelationInput | RoadmapTaskOrderByWithRelationInput[]
    cursor?: RoadmapTaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoadmapTaskScalarFieldEnum | RoadmapTaskScalarFieldEnum[]
  }

  /**
   * SkillGap without action
   */
  export type SkillGapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
  }


  /**
   * Model Roadmap
   */

  export type AggregateRoadmap = {
    _count: RoadmapCountAggregateOutputType | null
    _avg: RoadmapAvgAggregateOutputType | null
    _sum: RoadmapSumAggregateOutputType | null
    _min: RoadmapMinAggregateOutputType | null
    _max: RoadmapMaxAggregateOutputType | null
  }

  export type RoadmapAvgAggregateOutputType = {
    weekCount: number | null
  }

  export type RoadmapSumAggregateOutputType = {
    weekCount: number | null
  }

  export type RoadmapMinAggregateOutputType = {
    id: string | null
    careerAnalysisId: string | null
    weekCount: number | null
    createdAt: Date | null
  }

  export type RoadmapMaxAggregateOutputType = {
    id: string | null
    careerAnalysisId: string | null
    weekCount: number | null
    createdAt: Date | null
  }

  export type RoadmapCountAggregateOutputType = {
    id: number
    careerAnalysisId: number
    weekCount: number
    createdAt: number
    _all: number
  }


  export type RoadmapAvgAggregateInputType = {
    weekCount?: true
  }

  export type RoadmapSumAggregateInputType = {
    weekCount?: true
  }

  export type RoadmapMinAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    weekCount?: true
    createdAt?: true
  }

  export type RoadmapMaxAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    weekCount?: true
    createdAt?: true
  }

  export type RoadmapCountAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    weekCount?: true
    createdAt?: true
    _all?: true
  }

  export type RoadmapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roadmap to aggregate.
     */
    where?: RoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roadmaps to fetch.
     */
    orderBy?: RoadmapOrderByWithRelationInput | RoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roadmaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roadmaps
    **/
    _count?: true | RoadmapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoadmapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoadmapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoadmapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoadmapMaxAggregateInputType
  }

  export type GetRoadmapAggregateType<T extends RoadmapAggregateArgs> = {
        [P in keyof T & keyof AggregateRoadmap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoadmap[P]>
      : GetScalarType<T[P], AggregateRoadmap[P]>
  }




  export type RoadmapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapWhereInput
    orderBy?: RoadmapOrderByWithAggregationInput | RoadmapOrderByWithAggregationInput[]
    by: RoadmapScalarFieldEnum[] | RoadmapScalarFieldEnum
    having?: RoadmapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoadmapCountAggregateInputType | true
    _avg?: RoadmapAvgAggregateInputType
    _sum?: RoadmapSumAggregateInputType
    _min?: RoadmapMinAggregateInputType
    _max?: RoadmapMaxAggregateInputType
  }

  export type RoadmapGroupByOutputType = {
    id: string
    careerAnalysisId: string
    weekCount: number
    createdAt: Date
    _count: RoadmapCountAggregateOutputType | null
    _avg: RoadmapAvgAggregateOutputType | null
    _sum: RoadmapSumAggregateOutputType | null
    _min: RoadmapMinAggregateOutputType | null
    _max: RoadmapMaxAggregateOutputType | null
  }

  type GetRoadmapGroupByPayload<T extends RoadmapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoadmapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoadmapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoadmapGroupByOutputType[P]>
            : GetScalarType<T[P], RoadmapGroupByOutputType[P]>
        }
      >
    >


  export type RoadmapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    weekCount?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    tasks?: boolean | Roadmap$tasksArgs<ExtArgs>
    _count?: boolean | RoadmapCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmap"]>

  export type RoadmapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    weekCount?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmap"]>

  export type RoadmapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    weekCount?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roadmap"]>

  export type RoadmapSelectScalar = {
    id?: boolean
    careerAnalysisId?: boolean
    weekCount?: boolean
    createdAt?: boolean
  }

  export type RoadmapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "careerAnalysisId" | "weekCount" | "createdAt", ExtArgs["result"]["roadmap"]>
  export type RoadmapInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
    tasks?: boolean | Roadmap$tasksArgs<ExtArgs>
    _count?: boolean | RoadmapCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoadmapIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
  }
  export type RoadmapIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
  }

  export type $RoadmapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Roadmap"
    objects: {
      careerAnalysis: Prisma.$CareerAnalysisPayload<ExtArgs>
      tasks: Prisma.$RoadmapTaskPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      careerAnalysisId: string
      weekCount: number
      createdAt: Date
    }, ExtArgs["result"]["roadmap"]>
    composites: {}
  }

  type RoadmapGetPayload<S extends boolean | null | undefined | RoadmapDefaultArgs> = $Result.GetResult<Prisma.$RoadmapPayload, S>

  type RoadmapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoadmapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoadmapCountAggregateInputType | true
    }

  export interface RoadmapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Roadmap'], meta: { name: 'Roadmap' } }
    /**
     * Find zero or one Roadmap that matches the filter.
     * @param {RoadmapFindUniqueArgs} args - Arguments to find a Roadmap
     * @example
     * // Get one Roadmap
     * const roadmap = await prisma.roadmap.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoadmapFindUniqueArgs>(args: SelectSubset<T, RoadmapFindUniqueArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Roadmap that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoadmapFindUniqueOrThrowArgs} args - Arguments to find a Roadmap
     * @example
     * // Get one Roadmap
     * const roadmap = await prisma.roadmap.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoadmapFindUniqueOrThrowArgs>(args: SelectSubset<T, RoadmapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Roadmap that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapFindFirstArgs} args - Arguments to find a Roadmap
     * @example
     * // Get one Roadmap
     * const roadmap = await prisma.roadmap.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoadmapFindFirstArgs>(args?: SelectSubset<T, RoadmapFindFirstArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Roadmap that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapFindFirstOrThrowArgs} args - Arguments to find a Roadmap
     * @example
     * // Get one Roadmap
     * const roadmap = await prisma.roadmap.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoadmapFindFirstOrThrowArgs>(args?: SelectSubset<T, RoadmapFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roadmaps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roadmaps
     * const roadmaps = await prisma.roadmap.findMany()
     * 
     * // Get first 10 Roadmaps
     * const roadmaps = await prisma.roadmap.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roadmapWithIdOnly = await prisma.roadmap.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoadmapFindManyArgs>(args?: SelectSubset<T, RoadmapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Roadmap.
     * @param {RoadmapCreateArgs} args - Arguments to create a Roadmap.
     * @example
     * // Create one Roadmap
     * const Roadmap = await prisma.roadmap.create({
     *   data: {
     *     // ... data to create a Roadmap
     *   }
     * })
     * 
     */
    create<T extends RoadmapCreateArgs>(args: SelectSubset<T, RoadmapCreateArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roadmaps.
     * @param {RoadmapCreateManyArgs} args - Arguments to create many Roadmaps.
     * @example
     * // Create many Roadmaps
     * const roadmap = await prisma.roadmap.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoadmapCreateManyArgs>(args?: SelectSubset<T, RoadmapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roadmaps and returns the data saved in the database.
     * @param {RoadmapCreateManyAndReturnArgs} args - Arguments to create many Roadmaps.
     * @example
     * // Create many Roadmaps
     * const roadmap = await prisma.roadmap.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roadmaps and only return the `id`
     * const roadmapWithIdOnly = await prisma.roadmap.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoadmapCreateManyAndReturnArgs>(args?: SelectSubset<T, RoadmapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Roadmap.
     * @param {RoadmapDeleteArgs} args - Arguments to delete one Roadmap.
     * @example
     * // Delete one Roadmap
     * const Roadmap = await prisma.roadmap.delete({
     *   where: {
     *     // ... filter to delete one Roadmap
     *   }
     * })
     * 
     */
    delete<T extends RoadmapDeleteArgs>(args: SelectSubset<T, RoadmapDeleteArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Roadmap.
     * @param {RoadmapUpdateArgs} args - Arguments to update one Roadmap.
     * @example
     * // Update one Roadmap
     * const roadmap = await prisma.roadmap.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoadmapUpdateArgs>(args: SelectSubset<T, RoadmapUpdateArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roadmaps.
     * @param {RoadmapDeleteManyArgs} args - Arguments to filter Roadmaps to delete.
     * @example
     * // Delete a few Roadmaps
     * const { count } = await prisma.roadmap.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoadmapDeleteManyArgs>(args?: SelectSubset<T, RoadmapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roadmaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roadmaps
     * const roadmap = await prisma.roadmap.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoadmapUpdateManyArgs>(args: SelectSubset<T, RoadmapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roadmaps and returns the data updated in the database.
     * @param {RoadmapUpdateManyAndReturnArgs} args - Arguments to update many Roadmaps.
     * @example
     * // Update many Roadmaps
     * const roadmap = await prisma.roadmap.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roadmaps and only return the `id`
     * const roadmapWithIdOnly = await prisma.roadmap.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoadmapUpdateManyAndReturnArgs>(args: SelectSubset<T, RoadmapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Roadmap.
     * @param {RoadmapUpsertArgs} args - Arguments to update or create a Roadmap.
     * @example
     * // Update or create a Roadmap
     * const roadmap = await prisma.roadmap.upsert({
     *   create: {
     *     // ... data to create a Roadmap
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Roadmap we want to update
     *   }
     * })
     */
    upsert<T extends RoadmapUpsertArgs>(args: SelectSubset<T, RoadmapUpsertArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roadmaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapCountArgs} args - Arguments to filter Roadmaps to count.
     * @example
     * // Count the number of Roadmaps
     * const count = await prisma.roadmap.count({
     *   where: {
     *     // ... the filter for the Roadmaps we want to count
     *   }
     * })
    **/
    count<T extends RoadmapCountArgs>(
      args?: Subset<T, RoadmapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoadmapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Roadmap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoadmapAggregateArgs>(args: Subset<T, RoadmapAggregateArgs>): Prisma.PrismaPromise<GetRoadmapAggregateType<T>>

    /**
     * Group by Roadmap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoadmapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoadmapGroupByArgs['orderBy'] }
        : { orderBy?: RoadmapGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoadmapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Roadmap model
   */
  readonly fields: RoadmapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Roadmap.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoadmapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    careerAnalysis<T extends CareerAnalysisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CareerAnalysisDefaultArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tasks<T extends Roadmap$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Roadmap$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Roadmap model
   */
  interface RoadmapFieldRefs {
    readonly id: FieldRef<"Roadmap", 'String'>
    readonly careerAnalysisId: FieldRef<"Roadmap", 'String'>
    readonly weekCount: FieldRef<"Roadmap", 'Int'>
    readonly createdAt: FieldRef<"Roadmap", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Roadmap findUnique
   */
  export type RoadmapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter, which Roadmap to fetch.
     */
    where: RoadmapWhereUniqueInput
  }

  /**
   * Roadmap findUniqueOrThrow
   */
  export type RoadmapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter, which Roadmap to fetch.
     */
    where: RoadmapWhereUniqueInput
  }

  /**
   * Roadmap findFirst
   */
  export type RoadmapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter, which Roadmap to fetch.
     */
    where?: RoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roadmaps to fetch.
     */
    orderBy?: RoadmapOrderByWithRelationInput | RoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roadmaps.
     */
    cursor?: RoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roadmaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roadmaps.
     */
    distinct?: RoadmapScalarFieldEnum | RoadmapScalarFieldEnum[]
  }

  /**
   * Roadmap findFirstOrThrow
   */
  export type RoadmapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter, which Roadmap to fetch.
     */
    where?: RoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roadmaps to fetch.
     */
    orderBy?: RoadmapOrderByWithRelationInput | RoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roadmaps.
     */
    cursor?: RoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roadmaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roadmaps.
     */
    distinct?: RoadmapScalarFieldEnum | RoadmapScalarFieldEnum[]
  }

  /**
   * Roadmap findMany
   */
  export type RoadmapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter, which Roadmaps to fetch.
     */
    where?: RoadmapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roadmaps to fetch.
     */
    orderBy?: RoadmapOrderByWithRelationInput | RoadmapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roadmaps.
     */
    cursor?: RoadmapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roadmaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roadmaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roadmaps.
     */
    distinct?: RoadmapScalarFieldEnum | RoadmapScalarFieldEnum[]
  }

  /**
   * Roadmap create
   */
  export type RoadmapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * The data needed to create a Roadmap.
     */
    data: XOR<RoadmapCreateInput, RoadmapUncheckedCreateInput>
  }

  /**
   * Roadmap createMany
   */
  export type RoadmapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roadmaps.
     */
    data: RoadmapCreateManyInput | RoadmapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Roadmap createManyAndReturn
   */
  export type RoadmapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * The data used to create many Roadmaps.
     */
    data: RoadmapCreateManyInput | RoadmapCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Roadmap update
   */
  export type RoadmapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * The data needed to update a Roadmap.
     */
    data: XOR<RoadmapUpdateInput, RoadmapUncheckedUpdateInput>
    /**
     * Choose, which Roadmap to update.
     */
    where: RoadmapWhereUniqueInput
  }

  /**
   * Roadmap updateMany
   */
  export type RoadmapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roadmaps.
     */
    data: XOR<RoadmapUpdateManyMutationInput, RoadmapUncheckedUpdateManyInput>
    /**
     * Filter which Roadmaps to update
     */
    where?: RoadmapWhereInput
    /**
     * Limit how many Roadmaps to update.
     */
    limit?: number
  }

  /**
   * Roadmap updateManyAndReturn
   */
  export type RoadmapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * The data used to update Roadmaps.
     */
    data: XOR<RoadmapUpdateManyMutationInput, RoadmapUncheckedUpdateManyInput>
    /**
     * Filter which Roadmaps to update
     */
    where?: RoadmapWhereInput
    /**
     * Limit how many Roadmaps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Roadmap upsert
   */
  export type RoadmapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * The filter to search for the Roadmap to update in case it exists.
     */
    where: RoadmapWhereUniqueInput
    /**
     * In case the Roadmap found by the `where` argument doesn't exist, create a new Roadmap with this data.
     */
    create: XOR<RoadmapCreateInput, RoadmapUncheckedCreateInput>
    /**
     * In case the Roadmap was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoadmapUpdateInput, RoadmapUncheckedUpdateInput>
  }

  /**
   * Roadmap delete
   */
  export type RoadmapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
    /**
     * Filter which Roadmap to delete.
     */
    where: RoadmapWhereUniqueInput
  }

  /**
   * Roadmap deleteMany
   */
  export type RoadmapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roadmaps to delete
     */
    where?: RoadmapWhereInput
    /**
     * Limit how many Roadmaps to delete.
     */
    limit?: number
  }

  /**
   * Roadmap.tasks
   */
  export type Roadmap$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    where?: RoadmapTaskWhereInput
    orderBy?: RoadmapTaskOrderByWithRelationInput | RoadmapTaskOrderByWithRelationInput[]
    cursor?: RoadmapTaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoadmapTaskScalarFieldEnum | RoadmapTaskScalarFieldEnum[]
  }

  /**
   * Roadmap without action
   */
  export type RoadmapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roadmap
     */
    select?: RoadmapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Roadmap
     */
    omit?: RoadmapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapInclude<ExtArgs> | null
  }


  /**
   * Model RoadmapTask
   */

  export type AggregateRoadmapTask = {
    _count: RoadmapTaskCountAggregateOutputType | null
    _avg: RoadmapTaskAvgAggregateOutputType | null
    _sum: RoadmapTaskSumAggregateOutputType | null
    _min: RoadmapTaskMinAggregateOutputType | null
    _max: RoadmapTaskMaxAggregateOutputType | null
  }

  export type RoadmapTaskAvgAggregateOutputType = {
    weekNumber: number | null
    orderInWeek: number | null
  }

  export type RoadmapTaskSumAggregateOutputType = {
    weekNumber: number | null
    orderInWeek: number | null
  }

  export type RoadmapTaskMinAggregateOutputType = {
    id: string | null
    roadmapId: string | null
    skillGapId: string | null
    weekNumber: number | null
    orderInWeek: number | null
    title: string | null
    description: string | null
    completed: boolean | null
    completedAt: Date | null
    createdAt: Date | null
  }

  export type RoadmapTaskMaxAggregateOutputType = {
    id: string | null
    roadmapId: string | null
    skillGapId: string | null
    weekNumber: number | null
    orderInWeek: number | null
    title: string | null
    description: string | null
    completed: boolean | null
    completedAt: Date | null
    createdAt: Date | null
  }

  export type RoadmapTaskCountAggregateOutputType = {
    id: number
    roadmapId: number
    skillGapId: number
    weekNumber: number
    orderInWeek: number
    title: number
    description: number
    resources: number
    completed: number
    completedAt: number
    createdAt: number
    _all: number
  }


  export type RoadmapTaskAvgAggregateInputType = {
    weekNumber?: true
    orderInWeek?: true
  }

  export type RoadmapTaskSumAggregateInputType = {
    weekNumber?: true
    orderInWeek?: true
  }

  export type RoadmapTaskMinAggregateInputType = {
    id?: true
    roadmapId?: true
    skillGapId?: true
    weekNumber?: true
    orderInWeek?: true
    title?: true
    description?: true
    completed?: true
    completedAt?: true
    createdAt?: true
  }

  export type RoadmapTaskMaxAggregateInputType = {
    id?: true
    roadmapId?: true
    skillGapId?: true
    weekNumber?: true
    orderInWeek?: true
    title?: true
    description?: true
    completed?: true
    completedAt?: true
    createdAt?: true
  }

  export type RoadmapTaskCountAggregateInputType = {
    id?: true
    roadmapId?: true
    skillGapId?: true
    weekNumber?: true
    orderInWeek?: true
    title?: true
    description?: true
    resources?: true
    completed?: true
    completedAt?: true
    createdAt?: true
    _all?: true
  }

  export type RoadmapTaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapTask to aggregate.
     */
    where?: RoadmapTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapTasks to fetch.
     */
    orderBy?: RoadmapTaskOrderByWithRelationInput | RoadmapTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoadmapTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoadmapTasks
    **/
    _count?: true | RoadmapTaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoadmapTaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoadmapTaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoadmapTaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoadmapTaskMaxAggregateInputType
  }

  export type GetRoadmapTaskAggregateType<T extends RoadmapTaskAggregateArgs> = {
        [P in keyof T & keyof AggregateRoadmapTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoadmapTask[P]>
      : GetScalarType<T[P], AggregateRoadmapTask[P]>
  }




  export type RoadmapTaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoadmapTaskWhereInput
    orderBy?: RoadmapTaskOrderByWithAggregationInput | RoadmapTaskOrderByWithAggregationInput[]
    by: RoadmapTaskScalarFieldEnum[] | RoadmapTaskScalarFieldEnum
    having?: RoadmapTaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoadmapTaskCountAggregateInputType | true
    _avg?: RoadmapTaskAvgAggregateInputType
    _sum?: RoadmapTaskSumAggregateInputType
    _min?: RoadmapTaskMinAggregateInputType
    _max?: RoadmapTaskMaxAggregateInputType
  }

  export type RoadmapTaskGroupByOutputType = {
    id: string
    roadmapId: string
    skillGapId: string | null
    weekNumber: number
    orderInWeek: number
    title: string
    description: string
    resources: JsonValue | null
    completed: boolean
    completedAt: Date | null
    createdAt: Date
    _count: RoadmapTaskCountAggregateOutputType | null
    _avg: RoadmapTaskAvgAggregateOutputType | null
    _sum: RoadmapTaskSumAggregateOutputType | null
    _min: RoadmapTaskMinAggregateOutputType | null
    _max: RoadmapTaskMaxAggregateOutputType | null
  }

  type GetRoadmapTaskGroupByPayload<T extends RoadmapTaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoadmapTaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoadmapTaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoadmapTaskGroupByOutputType[P]>
            : GetScalarType<T[P], RoadmapTaskGroupByOutputType[P]>
        }
      >
    >


  export type RoadmapTaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    skillGapId?: boolean
    weekNumber?: boolean
    orderInWeek?: boolean
    title?: boolean
    description?: boolean
    resources?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    skillGap?: boolean | RoadmapTask$skillGapArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapTask"]>

  export type RoadmapTaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    skillGapId?: boolean
    weekNumber?: boolean
    orderInWeek?: boolean
    title?: boolean
    description?: boolean
    resources?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    skillGap?: boolean | RoadmapTask$skillGapArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapTask"]>

  export type RoadmapTaskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roadmapId?: boolean
    skillGapId?: boolean
    weekNumber?: boolean
    orderInWeek?: boolean
    title?: boolean
    description?: boolean
    resources?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    skillGap?: boolean | RoadmapTask$skillGapArgs<ExtArgs>
  }, ExtArgs["result"]["roadmapTask"]>

  export type RoadmapTaskSelectScalar = {
    id?: boolean
    roadmapId?: boolean
    skillGapId?: boolean
    weekNumber?: boolean
    orderInWeek?: boolean
    title?: boolean
    description?: boolean
    resources?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
  }

  export type RoadmapTaskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roadmapId" | "skillGapId" | "weekNumber" | "orderInWeek" | "title" | "description" | "resources" | "completed" | "completedAt" | "createdAt", ExtArgs["result"]["roadmapTask"]>
  export type RoadmapTaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    skillGap?: boolean | RoadmapTask$skillGapArgs<ExtArgs>
  }
  export type RoadmapTaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    skillGap?: boolean | RoadmapTask$skillGapArgs<ExtArgs>
  }
  export type RoadmapTaskIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roadmap?: boolean | RoadmapDefaultArgs<ExtArgs>
    skillGap?: boolean | RoadmapTask$skillGapArgs<ExtArgs>
  }

  export type $RoadmapTaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoadmapTask"
    objects: {
      roadmap: Prisma.$RoadmapPayload<ExtArgs>
      skillGap: Prisma.$SkillGapPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roadmapId: string
      skillGapId: string | null
      weekNumber: number
      orderInWeek: number
      title: string
      description: string
      resources: Prisma.JsonValue | null
      completed: boolean
      completedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["roadmapTask"]>
    composites: {}
  }

  type RoadmapTaskGetPayload<S extends boolean | null | undefined | RoadmapTaskDefaultArgs> = $Result.GetResult<Prisma.$RoadmapTaskPayload, S>

  type RoadmapTaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoadmapTaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoadmapTaskCountAggregateInputType | true
    }

  export interface RoadmapTaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoadmapTask'], meta: { name: 'RoadmapTask' } }
    /**
     * Find zero or one RoadmapTask that matches the filter.
     * @param {RoadmapTaskFindUniqueArgs} args - Arguments to find a RoadmapTask
     * @example
     * // Get one RoadmapTask
     * const roadmapTask = await prisma.roadmapTask.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoadmapTaskFindUniqueArgs>(args: SelectSubset<T, RoadmapTaskFindUniqueArgs<ExtArgs>>): Prisma__RoadmapTaskClient<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoadmapTask that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoadmapTaskFindUniqueOrThrowArgs} args - Arguments to find a RoadmapTask
     * @example
     * // Get one RoadmapTask
     * const roadmapTask = await prisma.roadmapTask.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoadmapTaskFindUniqueOrThrowArgs>(args: SelectSubset<T, RoadmapTaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoadmapTaskClient<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapTask that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTaskFindFirstArgs} args - Arguments to find a RoadmapTask
     * @example
     * // Get one RoadmapTask
     * const roadmapTask = await prisma.roadmapTask.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoadmapTaskFindFirstArgs>(args?: SelectSubset<T, RoadmapTaskFindFirstArgs<ExtArgs>>): Prisma__RoadmapTaskClient<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoadmapTask that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTaskFindFirstOrThrowArgs} args - Arguments to find a RoadmapTask
     * @example
     * // Get one RoadmapTask
     * const roadmapTask = await prisma.roadmapTask.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoadmapTaskFindFirstOrThrowArgs>(args?: SelectSubset<T, RoadmapTaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoadmapTaskClient<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoadmapTasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoadmapTasks
     * const roadmapTasks = await prisma.roadmapTask.findMany()
     * 
     * // Get first 10 RoadmapTasks
     * const roadmapTasks = await prisma.roadmapTask.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roadmapTaskWithIdOnly = await prisma.roadmapTask.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoadmapTaskFindManyArgs>(args?: SelectSubset<T, RoadmapTaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoadmapTask.
     * @param {RoadmapTaskCreateArgs} args - Arguments to create a RoadmapTask.
     * @example
     * // Create one RoadmapTask
     * const RoadmapTask = await prisma.roadmapTask.create({
     *   data: {
     *     // ... data to create a RoadmapTask
     *   }
     * })
     * 
     */
    create<T extends RoadmapTaskCreateArgs>(args: SelectSubset<T, RoadmapTaskCreateArgs<ExtArgs>>): Prisma__RoadmapTaskClient<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoadmapTasks.
     * @param {RoadmapTaskCreateManyArgs} args - Arguments to create many RoadmapTasks.
     * @example
     * // Create many RoadmapTasks
     * const roadmapTask = await prisma.roadmapTask.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoadmapTaskCreateManyArgs>(args?: SelectSubset<T, RoadmapTaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoadmapTasks and returns the data saved in the database.
     * @param {RoadmapTaskCreateManyAndReturnArgs} args - Arguments to create many RoadmapTasks.
     * @example
     * // Create many RoadmapTasks
     * const roadmapTask = await prisma.roadmapTask.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoadmapTasks and only return the `id`
     * const roadmapTaskWithIdOnly = await prisma.roadmapTask.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoadmapTaskCreateManyAndReturnArgs>(args?: SelectSubset<T, RoadmapTaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoadmapTask.
     * @param {RoadmapTaskDeleteArgs} args - Arguments to delete one RoadmapTask.
     * @example
     * // Delete one RoadmapTask
     * const RoadmapTask = await prisma.roadmapTask.delete({
     *   where: {
     *     // ... filter to delete one RoadmapTask
     *   }
     * })
     * 
     */
    delete<T extends RoadmapTaskDeleteArgs>(args: SelectSubset<T, RoadmapTaskDeleteArgs<ExtArgs>>): Prisma__RoadmapTaskClient<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoadmapTask.
     * @param {RoadmapTaskUpdateArgs} args - Arguments to update one RoadmapTask.
     * @example
     * // Update one RoadmapTask
     * const roadmapTask = await prisma.roadmapTask.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoadmapTaskUpdateArgs>(args: SelectSubset<T, RoadmapTaskUpdateArgs<ExtArgs>>): Prisma__RoadmapTaskClient<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoadmapTasks.
     * @param {RoadmapTaskDeleteManyArgs} args - Arguments to filter RoadmapTasks to delete.
     * @example
     * // Delete a few RoadmapTasks
     * const { count } = await prisma.roadmapTask.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoadmapTaskDeleteManyArgs>(args?: SelectSubset<T, RoadmapTaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoadmapTasks
     * const roadmapTask = await prisma.roadmapTask.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoadmapTaskUpdateManyArgs>(args: SelectSubset<T, RoadmapTaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoadmapTasks and returns the data updated in the database.
     * @param {RoadmapTaskUpdateManyAndReturnArgs} args - Arguments to update many RoadmapTasks.
     * @example
     * // Update many RoadmapTasks
     * const roadmapTask = await prisma.roadmapTask.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoadmapTasks and only return the `id`
     * const roadmapTaskWithIdOnly = await prisma.roadmapTask.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoadmapTaskUpdateManyAndReturnArgs>(args: SelectSubset<T, RoadmapTaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoadmapTask.
     * @param {RoadmapTaskUpsertArgs} args - Arguments to update or create a RoadmapTask.
     * @example
     * // Update or create a RoadmapTask
     * const roadmapTask = await prisma.roadmapTask.upsert({
     *   create: {
     *     // ... data to create a RoadmapTask
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoadmapTask we want to update
     *   }
     * })
     */
    upsert<T extends RoadmapTaskUpsertArgs>(args: SelectSubset<T, RoadmapTaskUpsertArgs<ExtArgs>>): Prisma__RoadmapTaskClient<$Result.GetResult<Prisma.$RoadmapTaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoadmapTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTaskCountArgs} args - Arguments to filter RoadmapTasks to count.
     * @example
     * // Count the number of RoadmapTasks
     * const count = await prisma.roadmapTask.count({
     *   where: {
     *     // ... the filter for the RoadmapTasks we want to count
     *   }
     * })
    **/
    count<T extends RoadmapTaskCountArgs>(
      args?: Subset<T, RoadmapTaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoadmapTaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoadmapTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoadmapTaskAggregateArgs>(args: Subset<T, RoadmapTaskAggregateArgs>): Prisma.PrismaPromise<GetRoadmapTaskAggregateType<T>>

    /**
     * Group by RoadmapTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoadmapTaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoadmapTaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoadmapTaskGroupByArgs['orderBy'] }
        : { orderBy?: RoadmapTaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoadmapTaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoadmapTask model
   */
  readonly fields: RoadmapTaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoadmapTask.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoadmapTaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roadmap<T extends RoadmapDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoadmapDefaultArgs<ExtArgs>>): Prisma__RoadmapClient<$Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    skillGap<T extends RoadmapTask$skillGapArgs<ExtArgs> = {}>(args?: Subset<T, RoadmapTask$skillGapArgs<ExtArgs>>): Prisma__SkillGapClient<$Result.GetResult<Prisma.$SkillGapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoadmapTask model
   */
  interface RoadmapTaskFieldRefs {
    readonly id: FieldRef<"RoadmapTask", 'String'>
    readonly roadmapId: FieldRef<"RoadmapTask", 'String'>
    readonly skillGapId: FieldRef<"RoadmapTask", 'String'>
    readonly weekNumber: FieldRef<"RoadmapTask", 'Int'>
    readonly orderInWeek: FieldRef<"RoadmapTask", 'Int'>
    readonly title: FieldRef<"RoadmapTask", 'String'>
    readonly description: FieldRef<"RoadmapTask", 'String'>
    readonly resources: FieldRef<"RoadmapTask", 'Json'>
    readonly completed: FieldRef<"RoadmapTask", 'Boolean'>
    readonly completedAt: FieldRef<"RoadmapTask", 'DateTime'>
    readonly createdAt: FieldRef<"RoadmapTask", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoadmapTask findUnique
   */
  export type RoadmapTaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapTask to fetch.
     */
    where: RoadmapTaskWhereUniqueInput
  }

  /**
   * RoadmapTask findUniqueOrThrow
   */
  export type RoadmapTaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapTask to fetch.
     */
    where: RoadmapTaskWhereUniqueInput
  }

  /**
   * RoadmapTask findFirst
   */
  export type RoadmapTaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapTask to fetch.
     */
    where?: RoadmapTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapTasks to fetch.
     */
    orderBy?: RoadmapTaskOrderByWithRelationInput | RoadmapTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapTasks.
     */
    cursor?: RoadmapTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapTasks.
     */
    distinct?: RoadmapTaskScalarFieldEnum | RoadmapTaskScalarFieldEnum[]
  }

  /**
   * RoadmapTask findFirstOrThrow
   */
  export type RoadmapTaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapTask to fetch.
     */
    where?: RoadmapTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapTasks to fetch.
     */
    orderBy?: RoadmapTaskOrderByWithRelationInput | RoadmapTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoadmapTasks.
     */
    cursor?: RoadmapTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapTasks.
     */
    distinct?: RoadmapTaskScalarFieldEnum | RoadmapTaskScalarFieldEnum[]
  }

  /**
   * RoadmapTask findMany
   */
  export type RoadmapTaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    /**
     * Filter, which RoadmapTasks to fetch.
     */
    where?: RoadmapTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoadmapTasks to fetch.
     */
    orderBy?: RoadmapTaskOrderByWithRelationInput | RoadmapTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoadmapTasks.
     */
    cursor?: RoadmapTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoadmapTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoadmapTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoadmapTasks.
     */
    distinct?: RoadmapTaskScalarFieldEnum | RoadmapTaskScalarFieldEnum[]
  }

  /**
   * RoadmapTask create
   */
  export type RoadmapTaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    /**
     * The data needed to create a RoadmapTask.
     */
    data: XOR<RoadmapTaskCreateInput, RoadmapTaskUncheckedCreateInput>
  }

  /**
   * RoadmapTask createMany
   */
  export type RoadmapTaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoadmapTasks.
     */
    data: RoadmapTaskCreateManyInput | RoadmapTaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoadmapTask createManyAndReturn
   */
  export type RoadmapTaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * The data used to create many RoadmapTasks.
     */
    data: RoadmapTaskCreateManyInput | RoadmapTaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadmapTask update
   */
  export type RoadmapTaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    /**
     * The data needed to update a RoadmapTask.
     */
    data: XOR<RoadmapTaskUpdateInput, RoadmapTaskUncheckedUpdateInput>
    /**
     * Choose, which RoadmapTask to update.
     */
    where: RoadmapTaskWhereUniqueInput
  }

  /**
   * RoadmapTask updateMany
   */
  export type RoadmapTaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoadmapTasks.
     */
    data: XOR<RoadmapTaskUpdateManyMutationInput, RoadmapTaskUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapTasks to update
     */
    where?: RoadmapTaskWhereInput
    /**
     * Limit how many RoadmapTasks to update.
     */
    limit?: number
  }

  /**
   * RoadmapTask updateManyAndReturn
   */
  export type RoadmapTaskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * The data used to update RoadmapTasks.
     */
    data: XOR<RoadmapTaskUpdateManyMutationInput, RoadmapTaskUncheckedUpdateManyInput>
    /**
     * Filter which RoadmapTasks to update
     */
    where?: RoadmapTaskWhereInput
    /**
     * Limit how many RoadmapTasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoadmapTask upsert
   */
  export type RoadmapTaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    /**
     * The filter to search for the RoadmapTask to update in case it exists.
     */
    where: RoadmapTaskWhereUniqueInput
    /**
     * In case the RoadmapTask found by the `where` argument doesn't exist, create a new RoadmapTask with this data.
     */
    create: XOR<RoadmapTaskCreateInput, RoadmapTaskUncheckedCreateInput>
    /**
     * In case the RoadmapTask was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoadmapTaskUpdateInput, RoadmapTaskUncheckedUpdateInput>
  }

  /**
   * RoadmapTask delete
   */
  export type RoadmapTaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
    /**
     * Filter which RoadmapTask to delete.
     */
    where: RoadmapTaskWhereUniqueInput
  }

  /**
   * RoadmapTask deleteMany
   */
  export type RoadmapTaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoadmapTasks to delete
     */
    where?: RoadmapTaskWhereInput
    /**
     * Limit how many RoadmapTasks to delete.
     */
    limit?: number
  }

  /**
   * RoadmapTask.skillGap
   */
  export type RoadmapTask$skillGapArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillGap
     */
    select?: SkillGapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillGap
     */
    omit?: SkillGapOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillGapInclude<ExtArgs> | null
    where?: SkillGapWhereInput
  }

  /**
   * RoadmapTask without action
   */
  export type RoadmapTaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoadmapTask
     */
    select?: RoadmapTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoadmapTask
     */
    omit?: RoadmapTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoadmapTaskInclude<ExtArgs> | null
  }


  /**
   * Model AnalysisEvent
   */

  export type AggregateAnalysisEvent = {
    _count: AnalysisEventCountAggregateOutputType | null
    _min: AnalysisEventMinAggregateOutputType | null
    _max: AnalysisEventMaxAggregateOutputType | null
  }

  export type AnalysisEventMinAggregateOutputType = {
    id: string | null
    careerAnalysisId: string | null
    type: $Enums.AnalysisEventType | null
    createdAt: Date | null
  }

  export type AnalysisEventMaxAggregateOutputType = {
    id: string | null
    careerAnalysisId: string | null
    type: $Enums.AnalysisEventType | null
    createdAt: Date | null
  }

  export type AnalysisEventCountAggregateOutputType = {
    id: number
    careerAnalysisId: number
    type: number
    payload: number
    createdAt: number
    _all: number
  }


  export type AnalysisEventMinAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    type?: true
    createdAt?: true
  }

  export type AnalysisEventMaxAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    type?: true
    createdAt?: true
  }

  export type AnalysisEventCountAggregateInputType = {
    id?: true
    careerAnalysisId?: true
    type?: true
    payload?: true
    createdAt?: true
    _all?: true
  }

  export type AnalysisEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisEvent to aggregate.
     */
    where?: AnalysisEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisEvents to fetch.
     */
    orderBy?: AnalysisEventOrderByWithRelationInput | AnalysisEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalysisEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnalysisEvents
    **/
    _count?: true | AnalysisEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalysisEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalysisEventMaxAggregateInputType
  }

  export type GetAnalysisEventAggregateType<T extends AnalysisEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalysisEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalysisEvent[P]>
      : GetScalarType<T[P], AggregateAnalysisEvent[P]>
  }




  export type AnalysisEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisEventWhereInput
    orderBy?: AnalysisEventOrderByWithAggregationInput | AnalysisEventOrderByWithAggregationInput[]
    by: AnalysisEventScalarFieldEnum[] | AnalysisEventScalarFieldEnum
    having?: AnalysisEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalysisEventCountAggregateInputType | true
    _min?: AnalysisEventMinAggregateInputType
    _max?: AnalysisEventMaxAggregateInputType
  }

  export type AnalysisEventGroupByOutputType = {
    id: string
    careerAnalysisId: string
    type: $Enums.AnalysisEventType
    payload: JsonValue | null
    createdAt: Date
    _count: AnalysisEventCountAggregateOutputType | null
    _min: AnalysisEventMinAggregateOutputType | null
    _max: AnalysisEventMaxAggregateOutputType | null
  }

  type GetAnalysisEventGroupByPayload<T extends AnalysisEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalysisEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalysisEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalysisEventGroupByOutputType[P]>
            : GetScalarType<T[P], AnalysisEventGroupByOutputType[P]>
        }
      >
    >


  export type AnalysisEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    type?: boolean
    payload?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisEvent"]>

  export type AnalysisEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    type?: boolean
    payload?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisEvent"]>

  export type AnalysisEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    careerAnalysisId?: boolean
    type?: boolean
    payload?: boolean
    createdAt?: boolean
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisEvent"]>

  export type AnalysisEventSelectScalar = {
    id?: boolean
    careerAnalysisId?: boolean
    type?: boolean
    payload?: boolean
    createdAt?: boolean
  }

  export type AnalysisEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "careerAnalysisId" | "type" | "payload" | "createdAt", ExtArgs["result"]["analysisEvent"]>
  export type AnalysisEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
  }
  export type AnalysisEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
  }
  export type AnalysisEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    careerAnalysis?: boolean | CareerAnalysisDefaultArgs<ExtArgs>
  }

  export type $AnalysisEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnalysisEvent"
    objects: {
      careerAnalysis: Prisma.$CareerAnalysisPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      careerAnalysisId: string
      type: $Enums.AnalysisEventType
      payload: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["analysisEvent"]>
    composites: {}
  }

  type AnalysisEventGetPayload<S extends boolean | null | undefined | AnalysisEventDefaultArgs> = $Result.GetResult<Prisma.$AnalysisEventPayload, S>

  type AnalysisEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalysisEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalysisEventCountAggregateInputType | true
    }

  export interface AnalysisEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnalysisEvent'], meta: { name: 'AnalysisEvent' } }
    /**
     * Find zero or one AnalysisEvent that matches the filter.
     * @param {AnalysisEventFindUniqueArgs} args - Arguments to find a AnalysisEvent
     * @example
     * // Get one AnalysisEvent
     * const analysisEvent = await prisma.analysisEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalysisEventFindUniqueArgs>(args: SelectSubset<T, AnalysisEventFindUniqueArgs<ExtArgs>>): Prisma__AnalysisEventClient<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnalysisEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalysisEventFindUniqueOrThrowArgs} args - Arguments to find a AnalysisEvent
     * @example
     * // Get one AnalysisEvent
     * const analysisEvent = await prisma.analysisEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalysisEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalysisEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalysisEventClient<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisEventFindFirstArgs} args - Arguments to find a AnalysisEvent
     * @example
     * // Get one AnalysisEvent
     * const analysisEvent = await prisma.analysisEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalysisEventFindFirstArgs>(args?: SelectSubset<T, AnalysisEventFindFirstArgs<ExtArgs>>): Prisma__AnalysisEventClient<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisEventFindFirstOrThrowArgs} args - Arguments to find a AnalysisEvent
     * @example
     * // Get one AnalysisEvent
     * const analysisEvent = await prisma.analysisEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalysisEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalysisEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalysisEventClient<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnalysisEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnalysisEvents
     * const analysisEvents = await prisma.analysisEvent.findMany()
     * 
     * // Get first 10 AnalysisEvents
     * const analysisEvents = await prisma.analysisEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analysisEventWithIdOnly = await prisma.analysisEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalysisEventFindManyArgs>(args?: SelectSubset<T, AnalysisEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnalysisEvent.
     * @param {AnalysisEventCreateArgs} args - Arguments to create a AnalysisEvent.
     * @example
     * // Create one AnalysisEvent
     * const AnalysisEvent = await prisma.analysisEvent.create({
     *   data: {
     *     // ... data to create a AnalysisEvent
     *   }
     * })
     * 
     */
    create<T extends AnalysisEventCreateArgs>(args: SelectSubset<T, AnalysisEventCreateArgs<ExtArgs>>): Prisma__AnalysisEventClient<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnalysisEvents.
     * @param {AnalysisEventCreateManyArgs} args - Arguments to create many AnalysisEvents.
     * @example
     * // Create many AnalysisEvents
     * const analysisEvent = await prisma.analysisEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalysisEventCreateManyArgs>(args?: SelectSubset<T, AnalysisEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnalysisEvents and returns the data saved in the database.
     * @param {AnalysisEventCreateManyAndReturnArgs} args - Arguments to create many AnalysisEvents.
     * @example
     * // Create many AnalysisEvents
     * const analysisEvent = await prisma.analysisEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnalysisEvents and only return the `id`
     * const analysisEventWithIdOnly = await prisma.analysisEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalysisEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalysisEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnalysisEvent.
     * @param {AnalysisEventDeleteArgs} args - Arguments to delete one AnalysisEvent.
     * @example
     * // Delete one AnalysisEvent
     * const AnalysisEvent = await prisma.analysisEvent.delete({
     *   where: {
     *     // ... filter to delete one AnalysisEvent
     *   }
     * })
     * 
     */
    delete<T extends AnalysisEventDeleteArgs>(args: SelectSubset<T, AnalysisEventDeleteArgs<ExtArgs>>): Prisma__AnalysisEventClient<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnalysisEvent.
     * @param {AnalysisEventUpdateArgs} args - Arguments to update one AnalysisEvent.
     * @example
     * // Update one AnalysisEvent
     * const analysisEvent = await prisma.analysisEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalysisEventUpdateArgs>(args: SelectSubset<T, AnalysisEventUpdateArgs<ExtArgs>>): Prisma__AnalysisEventClient<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnalysisEvents.
     * @param {AnalysisEventDeleteManyArgs} args - Arguments to filter AnalysisEvents to delete.
     * @example
     * // Delete a few AnalysisEvents
     * const { count } = await prisma.analysisEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalysisEventDeleteManyArgs>(args?: SelectSubset<T, AnalysisEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnalysisEvents
     * const analysisEvent = await prisma.analysisEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalysisEventUpdateManyArgs>(args: SelectSubset<T, AnalysisEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisEvents and returns the data updated in the database.
     * @param {AnalysisEventUpdateManyAndReturnArgs} args - Arguments to update many AnalysisEvents.
     * @example
     * // Update many AnalysisEvents
     * const analysisEvent = await prisma.analysisEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnalysisEvents and only return the `id`
     * const analysisEventWithIdOnly = await prisma.analysisEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnalysisEventUpdateManyAndReturnArgs>(args: SelectSubset<T, AnalysisEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnalysisEvent.
     * @param {AnalysisEventUpsertArgs} args - Arguments to update or create a AnalysisEvent.
     * @example
     * // Update or create a AnalysisEvent
     * const analysisEvent = await prisma.analysisEvent.upsert({
     *   create: {
     *     // ... data to create a AnalysisEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnalysisEvent we want to update
     *   }
     * })
     */
    upsert<T extends AnalysisEventUpsertArgs>(args: SelectSubset<T, AnalysisEventUpsertArgs<ExtArgs>>): Prisma__AnalysisEventClient<$Result.GetResult<Prisma.$AnalysisEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnalysisEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisEventCountArgs} args - Arguments to filter AnalysisEvents to count.
     * @example
     * // Count the number of AnalysisEvents
     * const count = await prisma.analysisEvent.count({
     *   where: {
     *     // ... the filter for the AnalysisEvents we want to count
     *   }
     * })
    **/
    count<T extends AnalysisEventCountArgs>(
      args?: Subset<T, AnalysisEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalysisEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnalysisEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalysisEventAggregateArgs>(args: Subset<T, AnalysisEventAggregateArgs>): Prisma.PrismaPromise<GetAnalysisEventAggregateType<T>>

    /**
     * Group by AnalysisEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalysisEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalysisEventGroupByArgs['orderBy'] }
        : { orderBy?: AnalysisEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalysisEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalysisEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnalysisEvent model
   */
  readonly fields: AnalysisEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnalysisEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalysisEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    careerAnalysis<T extends CareerAnalysisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CareerAnalysisDefaultArgs<ExtArgs>>): Prisma__CareerAnalysisClient<$Result.GetResult<Prisma.$CareerAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnalysisEvent model
   */
  interface AnalysisEventFieldRefs {
    readonly id: FieldRef<"AnalysisEvent", 'String'>
    readonly careerAnalysisId: FieldRef<"AnalysisEvent", 'String'>
    readonly type: FieldRef<"AnalysisEvent", 'AnalysisEventType'>
    readonly payload: FieldRef<"AnalysisEvent", 'Json'>
    readonly createdAt: FieldRef<"AnalysisEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnalysisEvent findUnique
   */
  export type AnalysisEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisEvent to fetch.
     */
    where: AnalysisEventWhereUniqueInput
  }

  /**
   * AnalysisEvent findUniqueOrThrow
   */
  export type AnalysisEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisEvent to fetch.
     */
    where: AnalysisEventWhereUniqueInput
  }

  /**
   * AnalysisEvent findFirst
   */
  export type AnalysisEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisEvent to fetch.
     */
    where?: AnalysisEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisEvents to fetch.
     */
    orderBy?: AnalysisEventOrderByWithRelationInput | AnalysisEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisEvents.
     */
    cursor?: AnalysisEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisEvents.
     */
    distinct?: AnalysisEventScalarFieldEnum | AnalysisEventScalarFieldEnum[]
  }

  /**
   * AnalysisEvent findFirstOrThrow
   */
  export type AnalysisEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisEvent to fetch.
     */
    where?: AnalysisEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisEvents to fetch.
     */
    orderBy?: AnalysisEventOrderByWithRelationInput | AnalysisEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisEvents.
     */
    cursor?: AnalysisEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisEvents.
     */
    distinct?: AnalysisEventScalarFieldEnum | AnalysisEventScalarFieldEnum[]
  }

  /**
   * AnalysisEvent findMany
   */
  export type AnalysisEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisEvents to fetch.
     */
    where?: AnalysisEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisEvents to fetch.
     */
    orderBy?: AnalysisEventOrderByWithRelationInput | AnalysisEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnalysisEvents.
     */
    cursor?: AnalysisEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisEvents.
     */
    distinct?: AnalysisEventScalarFieldEnum | AnalysisEventScalarFieldEnum[]
  }

  /**
   * AnalysisEvent create
   */
  export type AnalysisEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
    /**
     * The data needed to create a AnalysisEvent.
     */
    data: XOR<AnalysisEventCreateInput, AnalysisEventUncheckedCreateInput>
  }

  /**
   * AnalysisEvent createMany
   */
  export type AnalysisEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnalysisEvents.
     */
    data: AnalysisEventCreateManyInput | AnalysisEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnalysisEvent createManyAndReturn
   */
  export type AnalysisEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * The data used to create many AnalysisEvents.
     */
    data: AnalysisEventCreateManyInput | AnalysisEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalysisEvent update
   */
  export type AnalysisEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
    /**
     * The data needed to update a AnalysisEvent.
     */
    data: XOR<AnalysisEventUpdateInput, AnalysisEventUncheckedUpdateInput>
    /**
     * Choose, which AnalysisEvent to update.
     */
    where: AnalysisEventWhereUniqueInput
  }

  /**
   * AnalysisEvent updateMany
   */
  export type AnalysisEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnalysisEvents.
     */
    data: XOR<AnalysisEventUpdateManyMutationInput, AnalysisEventUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisEvents to update
     */
    where?: AnalysisEventWhereInput
    /**
     * Limit how many AnalysisEvents to update.
     */
    limit?: number
  }

  /**
   * AnalysisEvent updateManyAndReturn
   */
  export type AnalysisEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * The data used to update AnalysisEvents.
     */
    data: XOR<AnalysisEventUpdateManyMutationInput, AnalysisEventUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisEvents to update
     */
    where?: AnalysisEventWhereInput
    /**
     * Limit how many AnalysisEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalysisEvent upsert
   */
  export type AnalysisEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
    /**
     * The filter to search for the AnalysisEvent to update in case it exists.
     */
    where: AnalysisEventWhereUniqueInput
    /**
     * In case the AnalysisEvent found by the `where` argument doesn't exist, create a new AnalysisEvent with this data.
     */
    create: XOR<AnalysisEventCreateInput, AnalysisEventUncheckedCreateInput>
    /**
     * In case the AnalysisEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalysisEventUpdateInput, AnalysisEventUncheckedUpdateInput>
  }

  /**
   * AnalysisEvent delete
   */
  export type AnalysisEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
    /**
     * Filter which AnalysisEvent to delete.
     */
    where: AnalysisEventWhereUniqueInput
  }

  /**
   * AnalysisEvent deleteMany
   */
  export type AnalysisEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisEvents to delete
     */
    where?: AnalysisEventWhereInput
    /**
     * Limit how many AnalysisEvents to delete.
     */
    limit?: number
  }

  /**
   * AnalysisEvent without action
   */
  export type AnalysisEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisEvent
     */
    select?: AnalysisEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisEvent
     */
    omit?: AnalysisEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisEventInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RefreshTokenScalarFieldEnum: {
    id: 'id',
    familyId: 'familyId',
    tokenHash: 'tokenHash',
    userId: 'userId',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    revokedAt: 'revokedAt'
  };

  export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum]


  export const ResumeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    originalFileName: 'originalFileName',
    mimeType: 'mimeType',
    fileSize: 'fileSize',
    fileUrl: 'fileUrl',
    filePath: 'filePath',
    rawText: 'rawText',
    structuredResume: 'structuredResume',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ResumeScalarFieldEnum = (typeof ResumeScalarFieldEnum)[keyof typeof ResumeScalarFieldEnum]


  export const SkillScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    aliases: 'aliases',
    category: 'category',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SkillScalarFieldEnum = (typeof SkillScalarFieldEnum)[keyof typeof SkillScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    title: 'title',
    description: 'description',
    seedVersion: 'seedVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const RoleSkillRequirementScalarFieldEnum: {
    id: 'id',
    roleId: 'roleId',
    skillId: 'skillId',
    importance: 'importance',
    rationale: 'rationale',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoleSkillRequirementScalarFieldEnum = (typeof RoleSkillRequirementScalarFieldEnum)[keyof typeof RoleSkillRequirementScalarFieldEnum]


  export const CareerAnalysisScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    status: 'status',
    resumeId: 'resumeId',
    roleId: 'roleId',
    resumeSnapshot: 'resumeSnapshot',
    roleSnapshot: 'roleSnapshot',
    readinessScore: 'readinessScore',
    readinessBreakdown: 'readinessBreakdown',
    failureReason: 'failureReason',
    createdAt: 'createdAt',
    completedAt: 'completedAt'
  };

  export type CareerAnalysisScalarFieldEnum = (typeof CareerAnalysisScalarFieldEnum)[keyof typeof CareerAnalysisScalarFieldEnum]


  export const CandidateSkillEvidenceScalarFieldEnum: {
    id: 'id',
    careerAnalysisId: 'careerAnalysisId',
    skillId: 'skillId',
    strength: 'strength',
    quote: 'quote',
    sourceSection: 'sourceSection',
    sourceLabel: 'sourceLabel',
    createdAt: 'createdAt'
  };

  export type CandidateSkillEvidenceScalarFieldEnum = (typeof CandidateSkillEvidenceScalarFieldEnum)[keyof typeof CandidateSkillEvidenceScalarFieldEnum]


  export const SkillGapScalarFieldEnum: {
    id: 'id',
    careerAnalysisId: 'careerAnalysisId',
    skillId: 'skillId',
    status: 'status',
    priority: 'priority',
    reasoning: 'reasoning',
    createdAt: 'createdAt'
  };

  export type SkillGapScalarFieldEnum = (typeof SkillGapScalarFieldEnum)[keyof typeof SkillGapScalarFieldEnum]


  export const RoadmapScalarFieldEnum: {
    id: 'id',
    careerAnalysisId: 'careerAnalysisId',
    weekCount: 'weekCount',
    createdAt: 'createdAt'
  };

  export type RoadmapScalarFieldEnum = (typeof RoadmapScalarFieldEnum)[keyof typeof RoadmapScalarFieldEnum]


  export const RoadmapTaskScalarFieldEnum: {
    id: 'id',
    roadmapId: 'roadmapId',
    skillGapId: 'skillGapId',
    weekNumber: 'weekNumber',
    orderInWeek: 'orderInWeek',
    title: 'title',
    description: 'description',
    resources: 'resources',
    completed: 'completed',
    completedAt: 'completedAt',
    createdAt: 'createdAt'
  };

  export type RoadmapTaskScalarFieldEnum = (typeof RoadmapTaskScalarFieldEnum)[keyof typeof RoadmapTaskScalarFieldEnum]


  export const AnalysisEventScalarFieldEnum: {
    id: 'id',
    careerAnalysisId: 'careerAnalysisId',
    type: 'type',
    payload: 'payload',
    createdAt: 'createdAt'
  };

  export type AnalysisEventScalarFieldEnum = (typeof AnalysisEventScalarFieldEnum)[keyof typeof AnalysisEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'SkillImportance'
   */
  export type EnumSkillImportanceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SkillImportance'>
    


  /**
   * Reference to a field of type 'SkillImportance[]'
   */
  export type ListEnumSkillImportanceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SkillImportance[]'>
    


  /**
   * Reference to a field of type 'CareerAnalysisStatus'
   */
  export type EnumCareerAnalysisStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CareerAnalysisStatus'>
    


  /**
   * Reference to a field of type 'CareerAnalysisStatus[]'
   */
  export type ListEnumCareerAnalysisStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CareerAnalysisStatus[]'>
    


  /**
   * Reference to a field of type 'EvidenceStrength'
   */
  export type EnumEvidenceStrengthFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvidenceStrength'>
    


  /**
   * Reference to a field of type 'EvidenceStrength[]'
   */
  export type ListEnumEvidenceStrengthFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvidenceStrength[]'>
    


  /**
   * Reference to a field of type 'GapStatus'
   */
  export type EnumGapStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GapStatus'>
    


  /**
   * Reference to a field of type 'GapStatus[]'
   */
  export type ListEnumGapStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GapStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'AnalysisEventType'
   */
  export type EnumAnalysisEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AnalysisEventType'>
    


  /**
   * Reference to a field of type 'AnalysisEventType[]'
   */
  export type ListEnumAnalysisEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AnalysisEventType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    resumes?: ResumeListRelationFilter
    refreshTokens?: RefreshTokenListRelationFilter
    analyses?: CareerAnalysisListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resumes?: ResumeOrderByRelationAggregateInput
    refreshTokens?: RefreshTokenOrderByRelationAggregateInput
    analyses?: CareerAnalysisOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    resumes?: ResumeListRelationFilter
    refreshTokens?: RefreshTokenListRelationFilter
    analyses?: CareerAnalysisListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type RefreshTokenWhereInput = {
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    id?: UuidFilter<"RefreshToken"> | string
    familyId?: UuidFilter<"RefreshToken"> | string
    tokenHash?: StringFilter<"RefreshToken"> | string
    userId?: UuidFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    revokedAt?: DateTimeNullableFilter<"RefreshToken"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    familyId?: SortOrder
    tokenHash?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RefreshTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenHash?: string
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    familyId?: UuidFilter<"RefreshToken"> | string
    userId?: UuidFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    revokedAt?: DateTimeNullableFilter<"RefreshToken"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "tokenHash">

  export type RefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    familyId?: SortOrder
    tokenHash?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    _count?: RefreshTokenCountOrderByAggregateInput
    _max?: RefreshTokenMaxOrderByAggregateInput
    _min?: RefreshTokenMinOrderByAggregateInput
  }

  export type RefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"RefreshToken"> | string
    familyId?: UuidWithAggregatesFilter<"RefreshToken"> | string
    tokenHash?: StringWithAggregatesFilter<"RefreshToken"> | string
    userId?: UuidWithAggregatesFilter<"RefreshToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"RefreshToken"> | Date | string | null
  }

  export type ResumeWhereInput = {
    AND?: ResumeWhereInput | ResumeWhereInput[]
    OR?: ResumeWhereInput[]
    NOT?: ResumeWhereInput | ResumeWhereInput[]
    id?: UuidFilter<"Resume"> | string
    userId?: UuidFilter<"Resume"> | string
    title?: StringFilter<"Resume"> | string
    originalFileName?: StringFilter<"Resume"> | string
    mimeType?: StringFilter<"Resume"> | string
    fileSize?: IntFilter<"Resume"> | number
    fileUrl?: StringFilter<"Resume"> | string
    filePath?: StringNullableFilter<"Resume"> | string | null
    rawText?: StringFilter<"Resume"> | string
    structuredResume?: JsonFilter<"Resume">
    createdAt?: DateTimeFilter<"Resume"> | Date | string
    updatedAt?: DateTimeFilter<"Resume"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    analyses?: CareerAnalysisListRelationFilter
  }

  export type ResumeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    originalFileName?: SortOrder
    mimeType?: SortOrder
    fileSize?: SortOrder
    fileUrl?: SortOrder
    filePath?: SortOrderInput | SortOrder
    rawText?: SortOrder
    structuredResume?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    analyses?: CareerAnalysisOrderByRelationAggregateInput
  }

  export type ResumeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ResumeWhereInput | ResumeWhereInput[]
    OR?: ResumeWhereInput[]
    NOT?: ResumeWhereInput | ResumeWhereInput[]
    userId?: UuidFilter<"Resume"> | string
    title?: StringFilter<"Resume"> | string
    originalFileName?: StringFilter<"Resume"> | string
    mimeType?: StringFilter<"Resume"> | string
    fileSize?: IntFilter<"Resume"> | number
    fileUrl?: StringFilter<"Resume"> | string
    filePath?: StringNullableFilter<"Resume"> | string | null
    rawText?: StringFilter<"Resume"> | string
    structuredResume?: JsonFilter<"Resume">
    createdAt?: DateTimeFilter<"Resume"> | Date | string
    updatedAt?: DateTimeFilter<"Resume"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    analyses?: CareerAnalysisListRelationFilter
  }, "id">

  export type ResumeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    originalFileName?: SortOrder
    mimeType?: SortOrder
    fileSize?: SortOrder
    fileUrl?: SortOrder
    filePath?: SortOrderInput | SortOrder
    rawText?: SortOrder
    structuredResume?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ResumeCountOrderByAggregateInput
    _avg?: ResumeAvgOrderByAggregateInput
    _max?: ResumeMaxOrderByAggregateInput
    _min?: ResumeMinOrderByAggregateInput
    _sum?: ResumeSumOrderByAggregateInput
  }

  export type ResumeScalarWhereWithAggregatesInput = {
    AND?: ResumeScalarWhereWithAggregatesInput | ResumeScalarWhereWithAggregatesInput[]
    OR?: ResumeScalarWhereWithAggregatesInput[]
    NOT?: ResumeScalarWhereWithAggregatesInput | ResumeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Resume"> | string
    userId?: UuidWithAggregatesFilter<"Resume"> | string
    title?: StringWithAggregatesFilter<"Resume"> | string
    originalFileName?: StringWithAggregatesFilter<"Resume"> | string
    mimeType?: StringWithAggregatesFilter<"Resume"> | string
    fileSize?: IntWithAggregatesFilter<"Resume"> | number
    fileUrl?: StringWithAggregatesFilter<"Resume"> | string
    filePath?: StringNullableWithAggregatesFilter<"Resume"> | string | null
    rawText?: StringWithAggregatesFilter<"Resume"> | string
    structuredResume?: JsonWithAggregatesFilter<"Resume">
    createdAt?: DateTimeWithAggregatesFilter<"Resume"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Resume"> | Date | string
  }

  export type SkillWhereInput = {
    AND?: SkillWhereInput | SkillWhereInput[]
    OR?: SkillWhereInput[]
    NOT?: SkillWhereInput | SkillWhereInput[]
    id?: UuidFilter<"Skill"> | string
    slug?: StringFilter<"Skill"> | string
    name?: StringFilter<"Skill"> | string
    aliases?: StringNullableListFilter<"Skill">
    category?: StringNullableFilter<"Skill"> | string | null
    createdAt?: DateTimeFilter<"Skill"> | Date | string
    updatedAt?: DateTimeFilter<"Skill"> | Date | string
    requirements?: RoleSkillRequirementListRelationFilter
    evidence?: CandidateSkillEvidenceListRelationFilter
    gaps?: SkillGapListRelationFilter
  }

  export type SkillOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    aliases?: SortOrder
    category?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    requirements?: RoleSkillRequirementOrderByRelationAggregateInput
    evidence?: CandidateSkillEvidenceOrderByRelationAggregateInput
    gaps?: SkillGapOrderByRelationAggregateInput
  }

  export type SkillWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: SkillWhereInput | SkillWhereInput[]
    OR?: SkillWhereInput[]
    NOT?: SkillWhereInput | SkillWhereInput[]
    name?: StringFilter<"Skill"> | string
    aliases?: StringNullableListFilter<"Skill">
    category?: StringNullableFilter<"Skill"> | string | null
    createdAt?: DateTimeFilter<"Skill"> | Date | string
    updatedAt?: DateTimeFilter<"Skill"> | Date | string
    requirements?: RoleSkillRequirementListRelationFilter
    evidence?: CandidateSkillEvidenceListRelationFilter
    gaps?: SkillGapListRelationFilter
  }, "id" | "slug">

  export type SkillOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    aliases?: SortOrder
    category?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SkillCountOrderByAggregateInput
    _max?: SkillMaxOrderByAggregateInput
    _min?: SkillMinOrderByAggregateInput
  }

  export type SkillScalarWhereWithAggregatesInput = {
    AND?: SkillScalarWhereWithAggregatesInput | SkillScalarWhereWithAggregatesInput[]
    OR?: SkillScalarWhereWithAggregatesInput[]
    NOT?: SkillScalarWhereWithAggregatesInput | SkillScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Skill"> | string
    slug?: StringWithAggregatesFilter<"Skill"> | string
    name?: StringWithAggregatesFilter<"Skill"> | string
    aliases?: StringNullableListFilter<"Skill">
    category?: StringNullableWithAggregatesFilter<"Skill"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Skill"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Skill"> | Date | string
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: UuidFilter<"Role"> | string
    slug?: StringFilter<"Role"> | string
    title?: StringFilter<"Role"> | string
    description?: StringFilter<"Role"> | string
    seedVersion?: StringFilter<"Role"> | string
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    requirements?: RoleSkillRequirementListRelationFilter
    analyses?: CareerAnalysisListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    seedVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    requirements?: RoleSkillRequirementOrderByRelationAggregateInput
    analyses?: CareerAnalysisOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    title?: StringFilter<"Role"> | string
    description?: StringFilter<"Role"> | string
    seedVersion?: StringFilter<"Role"> | string
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    requirements?: RoleSkillRequirementListRelationFilter
    analyses?: CareerAnalysisListRelationFilter
  }, "id" | "slug">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    seedVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Role"> | string
    slug?: StringWithAggregatesFilter<"Role"> | string
    title?: StringWithAggregatesFilter<"Role"> | string
    description?: StringWithAggregatesFilter<"Role"> | string
    seedVersion?: StringWithAggregatesFilter<"Role"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
  }

  export type RoleSkillRequirementWhereInput = {
    AND?: RoleSkillRequirementWhereInput | RoleSkillRequirementWhereInput[]
    OR?: RoleSkillRequirementWhereInput[]
    NOT?: RoleSkillRequirementWhereInput | RoleSkillRequirementWhereInput[]
    id?: UuidFilter<"RoleSkillRequirement"> | string
    roleId?: UuidFilter<"RoleSkillRequirement"> | string
    skillId?: UuidFilter<"RoleSkillRequirement"> | string
    importance?: EnumSkillImportanceFilter<"RoleSkillRequirement"> | $Enums.SkillImportance
    rationale?: StringFilter<"RoleSkillRequirement"> | string
    createdAt?: DateTimeFilter<"RoleSkillRequirement"> | Date | string
    updatedAt?: DateTimeFilter<"RoleSkillRequirement"> | Date | string
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    skill?: XOR<SkillScalarRelationFilter, SkillWhereInput>
  }

  export type RoleSkillRequirementOrderByWithRelationInput = {
    id?: SortOrder
    roleId?: SortOrder
    skillId?: SortOrder
    importance?: SortOrder
    rationale?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: RoleOrderByWithRelationInput
    skill?: SkillOrderByWithRelationInput
  }

  export type RoleSkillRequirementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roleId_skillId?: RoleSkillRequirementRoleIdSkillIdCompoundUniqueInput
    AND?: RoleSkillRequirementWhereInput | RoleSkillRequirementWhereInput[]
    OR?: RoleSkillRequirementWhereInput[]
    NOT?: RoleSkillRequirementWhereInput | RoleSkillRequirementWhereInput[]
    roleId?: UuidFilter<"RoleSkillRequirement"> | string
    skillId?: UuidFilter<"RoleSkillRequirement"> | string
    importance?: EnumSkillImportanceFilter<"RoleSkillRequirement"> | $Enums.SkillImportance
    rationale?: StringFilter<"RoleSkillRequirement"> | string
    createdAt?: DateTimeFilter<"RoleSkillRequirement"> | Date | string
    updatedAt?: DateTimeFilter<"RoleSkillRequirement"> | Date | string
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    skill?: XOR<SkillScalarRelationFilter, SkillWhereInput>
  }, "id" | "roleId_skillId">

  export type RoleSkillRequirementOrderByWithAggregationInput = {
    id?: SortOrder
    roleId?: SortOrder
    skillId?: SortOrder
    importance?: SortOrder
    rationale?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoleSkillRequirementCountOrderByAggregateInput
    _max?: RoleSkillRequirementMaxOrderByAggregateInput
    _min?: RoleSkillRequirementMinOrderByAggregateInput
  }

  export type RoleSkillRequirementScalarWhereWithAggregatesInput = {
    AND?: RoleSkillRequirementScalarWhereWithAggregatesInput | RoleSkillRequirementScalarWhereWithAggregatesInput[]
    OR?: RoleSkillRequirementScalarWhereWithAggregatesInput[]
    NOT?: RoleSkillRequirementScalarWhereWithAggregatesInput | RoleSkillRequirementScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"RoleSkillRequirement"> | string
    roleId?: UuidWithAggregatesFilter<"RoleSkillRequirement"> | string
    skillId?: UuidWithAggregatesFilter<"RoleSkillRequirement"> | string
    importance?: EnumSkillImportanceWithAggregatesFilter<"RoleSkillRequirement"> | $Enums.SkillImportance
    rationale?: StringWithAggregatesFilter<"RoleSkillRequirement"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RoleSkillRequirement"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RoleSkillRequirement"> | Date | string
  }

  export type CareerAnalysisWhereInput = {
    AND?: CareerAnalysisWhereInput | CareerAnalysisWhereInput[]
    OR?: CareerAnalysisWhereInput[]
    NOT?: CareerAnalysisWhereInput | CareerAnalysisWhereInput[]
    id?: UuidFilter<"CareerAnalysis"> | string
    userId?: UuidFilter<"CareerAnalysis"> | string
    status?: EnumCareerAnalysisStatusFilter<"CareerAnalysis"> | $Enums.CareerAnalysisStatus
    resumeId?: UuidFilter<"CareerAnalysis"> | string
    roleId?: UuidFilter<"CareerAnalysis"> | string
    resumeSnapshot?: JsonFilter<"CareerAnalysis">
    roleSnapshot?: JsonFilter<"CareerAnalysis">
    readinessScore?: IntNullableFilter<"CareerAnalysis"> | number | null
    readinessBreakdown?: JsonNullableFilter<"CareerAnalysis">
    failureReason?: StringNullableFilter<"CareerAnalysis"> | string | null
    createdAt?: DateTimeFilter<"CareerAnalysis"> | Date | string
    completedAt?: DateTimeNullableFilter<"CareerAnalysis"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    resume?: XOR<ResumeScalarRelationFilter, ResumeWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    evidence?: CandidateSkillEvidenceListRelationFilter
    gaps?: SkillGapListRelationFilter
    roadmap?: XOR<RoadmapNullableScalarRelationFilter, RoadmapWhereInput> | null
    events?: AnalysisEventListRelationFilter
  }

  export type CareerAnalysisOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    resumeId?: SortOrder
    roleId?: SortOrder
    resumeSnapshot?: SortOrder
    roleSnapshot?: SortOrder
    readinessScore?: SortOrderInput | SortOrder
    readinessBreakdown?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    resume?: ResumeOrderByWithRelationInput
    role?: RoleOrderByWithRelationInput
    evidence?: CandidateSkillEvidenceOrderByRelationAggregateInput
    gaps?: SkillGapOrderByRelationAggregateInput
    roadmap?: RoadmapOrderByWithRelationInput
    events?: AnalysisEventOrderByRelationAggregateInput
  }

  export type CareerAnalysisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CareerAnalysisWhereInput | CareerAnalysisWhereInput[]
    OR?: CareerAnalysisWhereInput[]
    NOT?: CareerAnalysisWhereInput | CareerAnalysisWhereInput[]
    userId?: UuidFilter<"CareerAnalysis"> | string
    status?: EnumCareerAnalysisStatusFilter<"CareerAnalysis"> | $Enums.CareerAnalysisStatus
    resumeId?: UuidFilter<"CareerAnalysis"> | string
    roleId?: UuidFilter<"CareerAnalysis"> | string
    resumeSnapshot?: JsonFilter<"CareerAnalysis">
    roleSnapshot?: JsonFilter<"CareerAnalysis">
    readinessScore?: IntNullableFilter<"CareerAnalysis"> | number | null
    readinessBreakdown?: JsonNullableFilter<"CareerAnalysis">
    failureReason?: StringNullableFilter<"CareerAnalysis"> | string | null
    createdAt?: DateTimeFilter<"CareerAnalysis"> | Date | string
    completedAt?: DateTimeNullableFilter<"CareerAnalysis"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    resume?: XOR<ResumeScalarRelationFilter, ResumeWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    evidence?: CandidateSkillEvidenceListRelationFilter
    gaps?: SkillGapListRelationFilter
    roadmap?: XOR<RoadmapNullableScalarRelationFilter, RoadmapWhereInput> | null
    events?: AnalysisEventListRelationFilter
  }, "id">

  export type CareerAnalysisOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    resumeId?: SortOrder
    roleId?: SortOrder
    resumeSnapshot?: SortOrder
    roleSnapshot?: SortOrder
    readinessScore?: SortOrderInput | SortOrder
    readinessBreakdown?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: CareerAnalysisCountOrderByAggregateInput
    _avg?: CareerAnalysisAvgOrderByAggregateInput
    _max?: CareerAnalysisMaxOrderByAggregateInput
    _min?: CareerAnalysisMinOrderByAggregateInput
    _sum?: CareerAnalysisSumOrderByAggregateInput
  }

  export type CareerAnalysisScalarWhereWithAggregatesInput = {
    AND?: CareerAnalysisScalarWhereWithAggregatesInput | CareerAnalysisScalarWhereWithAggregatesInput[]
    OR?: CareerAnalysisScalarWhereWithAggregatesInput[]
    NOT?: CareerAnalysisScalarWhereWithAggregatesInput | CareerAnalysisScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CareerAnalysis"> | string
    userId?: UuidWithAggregatesFilter<"CareerAnalysis"> | string
    status?: EnumCareerAnalysisStatusWithAggregatesFilter<"CareerAnalysis"> | $Enums.CareerAnalysisStatus
    resumeId?: UuidWithAggregatesFilter<"CareerAnalysis"> | string
    roleId?: UuidWithAggregatesFilter<"CareerAnalysis"> | string
    resumeSnapshot?: JsonWithAggregatesFilter<"CareerAnalysis">
    roleSnapshot?: JsonWithAggregatesFilter<"CareerAnalysis">
    readinessScore?: IntNullableWithAggregatesFilter<"CareerAnalysis"> | number | null
    readinessBreakdown?: JsonNullableWithAggregatesFilter<"CareerAnalysis">
    failureReason?: StringNullableWithAggregatesFilter<"CareerAnalysis"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CareerAnalysis"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"CareerAnalysis"> | Date | string | null
  }

  export type CandidateSkillEvidenceWhereInput = {
    AND?: CandidateSkillEvidenceWhereInput | CandidateSkillEvidenceWhereInput[]
    OR?: CandidateSkillEvidenceWhereInput[]
    NOT?: CandidateSkillEvidenceWhereInput | CandidateSkillEvidenceWhereInput[]
    id?: UuidFilter<"CandidateSkillEvidence"> | string
    careerAnalysisId?: UuidFilter<"CandidateSkillEvidence"> | string
    skillId?: UuidFilter<"CandidateSkillEvidence"> | string
    strength?: EnumEvidenceStrengthFilter<"CandidateSkillEvidence"> | $Enums.EvidenceStrength
    quote?: StringFilter<"CandidateSkillEvidence"> | string
    sourceSection?: StringFilter<"CandidateSkillEvidence"> | string
    sourceLabel?: StringFilter<"CandidateSkillEvidence"> | string
    createdAt?: DateTimeFilter<"CandidateSkillEvidence"> | Date | string
    careerAnalysis?: XOR<CareerAnalysisScalarRelationFilter, CareerAnalysisWhereInput>
    skill?: XOR<SkillScalarRelationFilter, SkillWhereInput>
  }

  export type CandidateSkillEvidenceOrderByWithRelationInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    skillId?: SortOrder
    strength?: SortOrder
    quote?: SortOrder
    sourceSection?: SortOrder
    sourceLabel?: SortOrder
    createdAt?: SortOrder
    careerAnalysis?: CareerAnalysisOrderByWithRelationInput
    skill?: SkillOrderByWithRelationInput
  }

  export type CandidateSkillEvidenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CandidateSkillEvidenceWhereInput | CandidateSkillEvidenceWhereInput[]
    OR?: CandidateSkillEvidenceWhereInput[]
    NOT?: CandidateSkillEvidenceWhereInput | CandidateSkillEvidenceWhereInput[]
    careerAnalysisId?: UuidFilter<"CandidateSkillEvidence"> | string
    skillId?: UuidFilter<"CandidateSkillEvidence"> | string
    strength?: EnumEvidenceStrengthFilter<"CandidateSkillEvidence"> | $Enums.EvidenceStrength
    quote?: StringFilter<"CandidateSkillEvidence"> | string
    sourceSection?: StringFilter<"CandidateSkillEvidence"> | string
    sourceLabel?: StringFilter<"CandidateSkillEvidence"> | string
    createdAt?: DateTimeFilter<"CandidateSkillEvidence"> | Date | string
    careerAnalysis?: XOR<CareerAnalysisScalarRelationFilter, CareerAnalysisWhereInput>
    skill?: XOR<SkillScalarRelationFilter, SkillWhereInput>
  }, "id">

  export type CandidateSkillEvidenceOrderByWithAggregationInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    skillId?: SortOrder
    strength?: SortOrder
    quote?: SortOrder
    sourceSection?: SortOrder
    sourceLabel?: SortOrder
    createdAt?: SortOrder
    _count?: CandidateSkillEvidenceCountOrderByAggregateInput
    _max?: CandidateSkillEvidenceMaxOrderByAggregateInput
    _min?: CandidateSkillEvidenceMinOrderByAggregateInput
  }

  export type CandidateSkillEvidenceScalarWhereWithAggregatesInput = {
    AND?: CandidateSkillEvidenceScalarWhereWithAggregatesInput | CandidateSkillEvidenceScalarWhereWithAggregatesInput[]
    OR?: CandidateSkillEvidenceScalarWhereWithAggregatesInput[]
    NOT?: CandidateSkillEvidenceScalarWhereWithAggregatesInput | CandidateSkillEvidenceScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CandidateSkillEvidence"> | string
    careerAnalysisId?: UuidWithAggregatesFilter<"CandidateSkillEvidence"> | string
    skillId?: UuidWithAggregatesFilter<"CandidateSkillEvidence"> | string
    strength?: EnumEvidenceStrengthWithAggregatesFilter<"CandidateSkillEvidence"> | $Enums.EvidenceStrength
    quote?: StringWithAggregatesFilter<"CandidateSkillEvidence"> | string
    sourceSection?: StringWithAggregatesFilter<"CandidateSkillEvidence"> | string
    sourceLabel?: StringWithAggregatesFilter<"CandidateSkillEvidence"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CandidateSkillEvidence"> | Date | string
  }

  export type SkillGapWhereInput = {
    AND?: SkillGapWhereInput | SkillGapWhereInput[]
    OR?: SkillGapWhereInput[]
    NOT?: SkillGapWhereInput | SkillGapWhereInput[]
    id?: UuidFilter<"SkillGap"> | string
    careerAnalysisId?: UuidFilter<"SkillGap"> | string
    skillId?: UuidFilter<"SkillGap"> | string
    status?: EnumGapStatusFilter<"SkillGap"> | $Enums.GapStatus
    priority?: IntFilter<"SkillGap"> | number
    reasoning?: StringFilter<"SkillGap"> | string
    createdAt?: DateTimeFilter<"SkillGap"> | Date | string
    careerAnalysis?: XOR<CareerAnalysisScalarRelationFilter, CareerAnalysisWhereInput>
    skill?: XOR<SkillScalarRelationFilter, SkillWhereInput>
    tasks?: RoadmapTaskListRelationFilter
  }

  export type SkillGapOrderByWithRelationInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    skillId?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    reasoning?: SortOrder
    createdAt?: SortOrder
    careerAnalysis?: CareerAnalysisOrderByWithRelationInput
    skill?: SkillOrderByWithRelationInput
    tasks?: RoadmapTaskOrderByRelationAggregateInput
  }

  export type SkillGapWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    careerAnalysisId_skillId?: SkillGapCareerAnalysisIdSkillIdCompoundUniqueInput
    AND?: SkillGapWhereInput | SkillGapWhereInput[]
    OR?: SkillGapWhereInput[]
    NOT?: SkillGapWhereInput | SkillGapWhereInput[]
    careerAnalysisId?: UuidFilter<"SkillGap"> | string
    skillId?: UuidFilter<"SkillGap"> | string
    status?: EnumGapStatusFilter<"SkillGap"> | $Enums.GapStatus
    priority?: IntFilter<"SkillGap"> | number
    reasoning?: StringFilter<"SkillGap"> | string
    createdAt?: DateTimeFilter<"SkillGap"> | Date | string
    careerAnalysis?: XOR<CareerAnalysisScalarRelationFilter, CareerAnalysisWhereInput>
    skill?: XOR<SkillScalarRelationFilter, SkillWhereInput>
    tasks?: RoadmapTaskListRelationFilter
  }, "id" | "careerAnalysisId_skillId">

  export type SkillGapOrderByWithAggregationInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    skillId?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    reasoning?: SortOrder
    createdAt?: SortOrder
    _count?: SkillGapCountOrderByAggregateInput
    _avg?: SkillGapAvgOrderByAggregateInput
    _max?: SkillGapMaxOrderByAggregateInput
    _min?: SkillGapMinOrderByAggregateInput
    _sum?: SkillGapSumOrderByAggregateInput
  }

  export type SkillGapScalarWhereWithAggregatesInput = {
    AND?: SkillGapScalarWhereWithAggregatesInput | SkillGapScalarWhereWithAggregatesInput[]
    OR?: SkillGapScalarWhereWithAggregatesInput[]
    NOT?: SkillGapScalarWhereWithAggregatesInput | SkillGapScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SkillGap"> | string
    careerAnalysisId?: UuidWithAggregatesFilter<"SkillGap"> | string
    skillId?: UuidWithAggregatesFilter<"SkillGap"> | string
    status?: EnumGapStatusWithAggregatesFilter<"SkillGap"> | $Enums.GapStatus
    priority?: IntWithAggregatesFilter<"SkillGap"> | number
    reasoning?: StringWithAggregatesFilter<"SkillGap"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SkillGap"> | Date | string
  }

  export type RoadmapWhereInput = {
    AND?: RoadmapWhereInput | RoadmapWhereInput[]
    OR?: RoadmapWhereInput[]
    NOT?: RoadmapWhereInput | RoadmapWhereInput[]
    id?: UuidFilter<"Roadmap"> | string
    careerAnalysisId?: UuidFilter<"Roadmap"> | string
    weekCount?: IntFilter<"Roadmap"> | number
    createdAt?: DateTimeFilter<"Roadmap"> | Date | string
    careerAnalysis?: XOR<CareerAnalysisScalarRelationFilter, CareerAnalysisWhereInput>
    tasks?: RoadmapTaskListRelationFilter
  }

  export type RoadmapOrderByWithRelationInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    weekCount?: SortOrder
    createdAt?: SortOrder
    careerAnalysis?: CareerAnalysisOrderByWithRelationInput
    tasks?: RoadmapTaskOrderByRelationAggregateInput
  }

  export type RoadmapWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    careerAnalysisId?: string
    AND?: RoadmapWhereInput | RoadmapWhereInput[]
    OR?: RoadmapWhereInput[]
    NOT?: RoadmapWhereInput | RoadmapWhereInput[]
    weekCount?: IntFilter<"Roadmap"> | number
    createdAt?: DateTimeFilter<"Roadmap"> | Date | string
    careerAnalysis?: XOR<CareerAnalysisScalarRelationFilter, CareerAnalysisWhereInput>
    tasks?: RoadmapTaskListRelationFilter
  }, "id" | "careerAnalysisId">

  export type RoadmapOrderByWithAggregationInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    weekCount?: SortOrder
    createdAt?: SortOrder
    _count?: RoadmapCountOrderByAggregateInput
    _avg?: RoadmapAvgOrderByAggregateInput
    _max?: RoadmapMaxOrderByAggregateInput
    _min?: RoadmapMinOrderByAggregateInput
    _sum?: RoadmapSumOrderByAggregateInput
  }

  export type RoadmapScalarWhereWithAggregatesInput = {
    AND?: RoadmapScalarWhereWithAggregatesInput | RoadmapScalarWhereWithAggregatesInput[]
    OR?: RoadmapScalarWhereWithAggregatesInput[]
    NOT?: RoadmapScalarWhereWithAggregatesInput | RoadmapScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Roadmap"> | string
    careerAnalysisId?: UuidWithAggregatesFilter<"Roadmap"> | string
    weekCount?: IntWithAggregatesFilter<"Roadmap"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Roadmap"> | Date | string
  }

  export type RoadmapTaskWhereInput = {
    AND?: RoadmapTaskWhereInput | RoadmapTaskWhereInput[]
    OR?: RoadmapTaskWhereInput[]
    NOT?: RoadmapTaskWhereInput | RoadmapTaskWhereInput[]
    id?: UuidFilter<"RoadmapTask"> | string
    roadmapId?: UuidFilter<"RoadmapTask"> | string
    skillGapId?: UuidNullableFilter<"RoadmapTask"> | string | null
    weekNumber?: IntFilter<"RoadmapTask"> | number
    orderInWeek?: IntFilter<"RoadmapTask"> | number
    title?: StringFilter<"RoadmapTask"> | string
    description?: StringFilter<"RoadmapTask"> | string
    resources?: JsonNullableFilter<"RoadmapTask">
    completed?: BoolFilter<"RoadmapTask"> | boolean
    completedAt?: DateTimeNullableFilter<"RoadmapTask"> | Date | string | null
    createdAt?: DateTimeFilter<"RoadmapTask"> | Date | string
    roadmap?: XOR<RoadmapScalarRelationFilter, RoadmapWhereInput>
    skillGap?: XOR<SkillGapNullableScalarRelationFilter, SkillGapWhereInput> | null
  }

  export type RoadmapTaskOrderByWithRelationInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    skillGapId?: SortOrderInput | SortOrder
    weekNumber?: SortOrder
    orderInWeek?: SortOrder
    title?: SortOrder
    description?: SortOrder
    resources?: SortOrderInput | SortOrder
    completed?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    roadmap?: RoadmapOrderByWithRelationInput
    skillGap?: SkillGapOrderByWithRelationInput
  }

  export type RoadmapTaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoadmapTaskWhereInput | RoadmapTaskWhereInput[]
    OR?: RoadmapTaskWhereInput[]
    NOT?: RoadmapTaskWhereInput | RoadmapTaskWhereInput[]
    roadmapId?: UuidFilter<"RoadmapTask"> | string
    skillGapId?: UuidNullableFilter<"RoadmapTask"> | string | null
    weekNumber?: IntFilter<"RoadmapTask"> | number
    orderInWeek?: IntFilter<"RoadmapTask"> | number
    title?: StringFilter<"RoadmapTask"> | string
    description?: StringFilter<"RoadmapTask"> | string
    resources?: JsonNullableFilter<"RoadmapTask">
    completed?: BoolFilter<"RoadmapTask"> | boolean
    completedAt?: DateTimeNullableFilter<"RoadmapTask"> | Date | string | null
    createdAt?: DateTimeFilter<"RoadmapTask"> | Date | string
    roadmap?: XOR<RoadmapScalarRelationFilter, RoadmapWhereInput>
    skillGap?: XOR<SkillGapNullableScalarRelationFilter, SkillGapWhereInput> | null
  }, "id">

  export type RoadmapTaskOrderByWithAggregationInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    skillGapId?: SortOrderInput | SortOrder
    weekNumber?: SortOrder
    orderInWeek?: SortOrder
    title?: SortOrder
    description?: SortOrder
    resources?: SortOrderInput | SortOrder
    completed?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RoadmapTaskCountOrderByAggregateInput
    _avg?: RoadmapTaskAvgOrderByAggregateInput
    _max?: RoadmapTaskMaxOrderByAggregateInput
    _min?: RoadmapTaskMinOrderByAggregateInput
    _sum?: RoadmapTaskSumOrderByAggregateInput
  }

  export type RoadmapTaskScalarWhereWithAggregatesInput = {
    AND?: RoadmapTaskScalarWhereWithAggregatesInput | RoadmapTaskScalarWhereWithAggregatesInput[]
    OR?: RoadmapTaskScalarWhereWithAggregatesInput[]
    NOT?: RoadmapTaskScalarWhereWithAggregatesInput | RoadmapTaskScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"RoadmapTask"> | string
    roadmapId?: UuidWithAggregatesFilter<"RoadmapTask"> | string
    skillGapId?: UuidNullableWithAggregatesFilter<"RoadmapTask"> | string | null
    weekNumber?: IntWithAggregatesFilter<"RoadmapTask"> | number
    orderInWeek?: IntWithAggregatesFilter<"RoadmapTask"> | number
    title?: StringWithAggregatesFilter<"RoadmapTask"> | string
    description?: StringWithAggregatesFilter<"RoadmapTask"> | string
    resources?: JsonNullableWithAggregatesFilter<"RoadmapTask">
    completed?: BoolWithAggregatesFilter<"RoadmapTask"> | boolean
    completedAt?: DateTimeNullableWithAggregatesFilter<"RoadmapTask"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RoadmapTask"> | Date | string
  }

  export type AnalysisEventWhereInput = {
    AND?: AnalysisEventWhereInput | AnalysisEventWhereInput[]
    OR?: AnalysisEventWhereInput[]
    NOT?: AnalysisEventWhereInput | AnalysisEventWhereInput[]
    id?: UuidFilter<"AnalysisEvent"> | string
    careerAnalysisId?: UuidFilter<"AnalysisEvent"> | string
    type?: EnumAnalysisEventTypeFilter<"AnalysisEvent"> | $Enums.AnalysisEventType
    payload?: JsonNullableFilter<"AnalysisEvent">
    createdAt?: DateTimeFilter<"AnalysisEvent"> | Date | string
    careerAnalysis?: XOR<CareerAnalysisScalarRelationFilter, CareerAnalysisWhereInput>
  }

  export type AnalysisEventOrderByWithRelationInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    type?: SortOrder
    payload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    careerAnalysis?: CareerAnalysisOrderByWithRelationInput
  }

  export type AnalysisEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnalysisEventWhereInput | AnalysisEventWhereInput[]
    OR?: AnalysisEventWhereInput[]
    NOT?: AnalysisEventWhereInput | AnalysisEventWhereInput[]
    careerAnalysisId?: UuidFilter<"AnalysisEvent"> | string
    type?: EnumAnalysisEventTypeFilter<"AnalysisEvent"> | $Enums.AnalysisEventType
    payload?: JsonNullableFilter<"AnalysisEvent">
    createdAt?: DateTimeFilter<"AnalysisEvent"> | Date | string
    careerAnalysis?: XOR<CareerAnalysisScalarRelationFilter, CareerAnalysisWhereInput>
  }, "id">

  export type AnalysisEventOrderByWithAggregationInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    type?: SortOrder
    payload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AnalysisEventCountOrderByAggregateInput
    _max?: AnalysisEventMaxOrderByAggregateInput
    _min?: AnalysisEventMinOrderByAggregateInput
  }

  export type AnalysisEventScalarWhereWithAggregatesInput = {
    AND?: AnalysisEventScalarWhereWithAggregatesInput | AnalysisEventScalarWhereWithAggregatesInput[]
    OR?: AnalysisEventScalarWhereWithAggregatesInput[]
    NOT?: AnalysisEventScalarWhereWithAggregatesInput | AnalysisEventScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AnalysisEvent"> | string
    careerAnalysisId?: UuidWithAggregatesFilter<"AnalysisEvent"> | string
    type?: EnumAnalysisEventTypeWithAggregatesFilter<"AnalysisEvent"> | $Enums.AnalysisEventType
    payload?: JsonNullableWithAggregatesFilter<"AnalysisEvent">
    createdAt?: DateTimeWithAggregatesFilter<"AnalysisEvent"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resumes?: ResumeCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    analyses?: CareerAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    analyses?: CareerAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    analyses?: CareerAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    analyses?: CareerAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateInput = {
    id?: string
    familyId: string
    tokenHash: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
    user: UserCreateNestedOneWithoutRefreshTokensInput
  }

  export type RefreshTokenUncheckedCreateInput = {
    id?: string
    familyId: string
    tokenHash: string
    userId: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type RefreshTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    familyId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutRefreshTokensNestedInput
  }

  export type RefreshTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    familyId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefreshTokenCreateManyInput = {
    id?: string
    familyId: string
    tokenHash: string
    userId: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type RefreshTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    familyId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefreshTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    familyId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ResumeCreateInput = {
    id?: string
    title: string
    originalFileName: string
    mimeType: string
    fileSize: number
    fileUrl: string
    filePath?: string | null
    rawText: string
    structuredResume: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutResumesInput
    analyses?: CareerAnalysisCreateNestedManyWithoutResumeInput
  }

  export type ResumeUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    originalFileName: string
    mimeType: string
    fileSize: number
    fileUrl: string
    filePath?: string | null
    rawText: string
    structuredResume: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    analyses?: CareerAnalysisUncheckedCreateNestedManyWithoutResumeInput
  }

  export type ResumeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileUrl?: StringFieldUpdateOperationsInput | string
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    rawText?: StringFieldUpdateOperationsInput | string
    structuredResume?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutResumesNestedInput
    analyses?: CareerAnalysisUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileUrl?: StringFieldUpdateOperationsInput | string
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    rawText?: StringFieldUpdateOperationsInput | string
    structuredResume?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analyses?: CareerAnalysisUncheckedUpdateManyWithoutResumeNestedInput
  }

  export type ResumeCreateManyInput = {
    id?: string
    userId: string
    title: string
    originalFileName: string
    mimeType: string
    fileSize: number
    fileUrl: string
    filePath?: string | null
    rawText: string
    structuredResume: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ResumeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileUrl?: StringFieldUpdateOperationsInput | string
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    rawText?: StringFieldUpdateOperationsInput | string
    structuredResume?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileUrl?: StringFieldUpdateOperationsInput | string
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    rawText?: StringFieldUpdateOperationsInput | string
    structuredResume?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillCreateInput = {
    id?: string
    slug: string
    name: string
    aliases?: SkillCreatealiasesInput | string[]
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RoleSkillRequirementCreateNestedManyWithoutSkillInput
    evidence?: CandidateSkillEvidenceCreateNestedManyWithoutSkillInput
    gaps?: SkillGapCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    aliases?: SkillCreatealiasesInput | string[]
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RoleSkillRequirementUncheckedCreateNestedManyWithoutSkillInput
    evidence?: CandidateSkillEvidenceUncheckedCreateNestedManyWithoutSkillInput
    gaps?: SkillGapUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    aliases?: SkillUpdatealiasesInput | string[]
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RoleSkillRequirementUpdateManyWithoutSkillNestedInput
    evidence?: CandidateSkillEvidenceUpdateManyWithoutSkillNestedInput
    gaps?: SkillGapUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    aliases?: SkillUpdatealiasesInput | string[]
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RoleSkillRequirementUncheckedUpdateManyWithoutSkillNestedInput
    evidence?: CandidateSkillEvidenceUncheckedUpdateManyWithoutSkillNestedInput
    gaps?: SkillGapUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type SkillCreateManyInput = {
    id?: string
    slug: string
    name: string
    aliases?: SkillCreatealiasesInput | string[]
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    aliases?: SkillUpdatealiasesInput | string[]
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    aliases?: SkillUpdatealiasesInput | string[]
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleCreateInput = {
    id?: string
    slug: string
    title: string
    description: string
    seedVersion: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RoleSkillRequirementCreateNestedManyWithoutRoleInput
    analyses?: CareerAnalysisCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: string
    slug: string
    title: string
    description: string
    seedVersion: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RoleSkillRequirementUncheckedCreateNestedManyWithoutRoleInput
    analyses?: CareerAnalysisUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    seedVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RoleSkillRequirementUpdateManyWithoutRoleNestedInput
    analyses?: CareerAnalysisUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    seedVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RoleSkillRequirementUncheckedUpdateManyWithoutRoleNestedInput
    analyses?: CareerAnalysisUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: string
    slug: string
    title: string
    description: string
    seedVersion: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    seedVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    seedVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleSkillRequirementCreateInput = {
    id?: string
    importance: $Enums.SkillImportance
    rationale: string
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutRequirementsInput
    skill: SkillCreateNestedOneWithoutRequirementsInput
  }

  export type RoleSkillRequirementUncheckedCreateInput = {
    id?: string
    roleId: string
    skillId: string
    importance: $Enums.SkillImportance
    rationale: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleSkillRequirementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    importance?: EnumSkillImportanceFieldUpdateOperationsInput | $Enums.SkillImportance
    rationale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutRequirementsNestedInput
    skill?: SkillUpdateOneRequiredWithoutRequirementsNestedInput
  }

  export type RoleSkillRequirementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    importance?: EnumSkillImportanceFieldUpdateOperationsInput | $Enums.SkillImportance
    rationale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleSkillRequirementCreateManyInput = {
    id?: string
    roleId: string
    skillId: string
    importance: $Enums.SkillImportance
    rationale: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleSkillRequirementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    importance?: EnumSkillImportanceFieldUpdateOperationsInput | $Enums.SkillImportance
    rationale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleSkillRequirementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    importance?: EnumSkillImportanceFieldUpdateOperationsInput | $Enums.SkillImportance
    rationale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareerAnalysisCreateInput = {
    id?: string
    status?: $Enums.CareerAnalysisStatus
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutAnalysesInput
    resume: ResumeCreateNestedOneWithoutAnalysesInput
    role: RoleCreateNestedOneWithoutAnalysesInput
    evidence?: CandidateSkillEvidenceCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisUncheckedCreateInput = {
    id?: string
    userId: string
    status?: $Enums.CareerAnalysisStatus
    resumeId: string
    roleId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapUncheckedCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapUncheckedCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventUncheckedCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput
    resume?: ResumeUpdateOneRequiredWithoutAnalysesNestedInput
    role?: RoleUpdateOneRequiredWithoutAnalysesNestedInput
    evidence?: CandidateSkillEvidenceUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUncheckedUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUncheckedUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisCreateManyInput = {
    id?: string
    userId: string
    status?: $Enums.CareerAnalysisStatus
    resumeId: string
    roleId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type CareerAnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CareerAnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CandidateSkillEvidenceCreateInput = {
    id?: string
    strength: $Enums.EvidenceStrength
    quote: string
    sourceSection: string
    sourceLabel: string
    createdAt?: Date | string
    careerAnalysis: CareerAnalysisCreateNestedOneWithoutEvidenceInput
    skill: SkillCreateNestedOneWithoutEvidenceInput
  }

  export type CandidateSkillEvidenceUncheckedCreateInput = {
    id?: string
    careerAnalysisId: string
    skillId: string
    strength: $Enums.EvidenceStrength
    quote: string
    sourceSection: string
    sourceLabel: string
    createdAt?: Date | string
  }

  export type CandidateSkillEvidenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    strength?: EnumEvidenceStrengthFieldUpdateOperationsInput | $Enums.EvidenceStrength
    quote?: StringFieldUpdateOperationsInput | string
    sourceSection?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    careerAnalysis?: CareerAnalysisUpdateOneRequiredWithoutEvidenceNestedInput
    skill?: SkillUpdateOneRequiredWithoutEvidenceNestedInput
  }

  export type CandidateSkillEvidenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    strength?: EnumEvidenceStrengthFieldUpdateOperationsInput | $Enums.EvidenceStrength
    quote?: StringFieldUpdateOperationsInput | string
    sourceSection?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CandidateSkillEvidenceCreateManyInput = {
    id?: string
    careerAnalysisId: string
    skillId: string
    strength: $Enums.EvidenceStrength
    quote: string
    sourceSection: string
    sourceLabel: string
    createdAt?: Date | string
  }

  export type CandidateSkillEvidenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    strength?: EnumEvidenceStrengthFieldUpdateOperationsInput | $Enums.EvidenceStrength
    quote?: StringFieldUpdateOperationsInput | string
    sourceSection?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CandidateSkillEvidenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    strength?: EnumEvidenceStrengthFieldUpdateOperationsInput | $Enums.EvidenceStrength
    quote?: StringFieldUpdateOperationsInput | string
    sourceSection?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillGapCreateInput = {
    id?: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
    careerAnalysis: CareerAnalysisCreateNestedOneWithoutGapsInput
    skill: SkillCreateNestedOneWithoutGapsInput
    tasks?: RoadmapTaskCreateNestedManyWithoutSkillGapInput
  }

  export type SkillGapUncheckedCreateInput = {
    id?: string
    careerAnalysisId: string
    skillId: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
    tasks?: RoadmapTaskUncheckedCreateNestedManyWithoutSkillGapInput
  }

  export type SkillGapUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    careerAnalysis?: CareerAnalysisUpdateOneRequiredWithoutGapsNestedInput
    skill?: SkillUpdateOneRequiredWithoutGapsNestedInput
    tasks?: RoadmapTaskUpdateManyWithoutSkillGapNestedInput
  }

  export type SkillGapUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: RoadmapTaskUncheckedUpdateManyWithoutSkillGapNestedInput
  }

  export type SkillGapCreateManyInput = {
    id?: string
    careerAnalysisId: string
    skillId: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
  }

  export type SkillGapUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillGapUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapCreateInput = {
    id?: string
    weekCount?: number
    createdAt?: Date | string
    careerAnalysis: CareerAnalysisCreateNestedOneWithoutRoadmapInput
    tasks?: RoadmapTaskCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapUncheckedCreateInput = {
    id?: string
    careerAnalysisId: string
    weekCount?: number
    createdAt?: Date | string
    tasks?: RoadmapTaskUncheckedCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    careerAnalysis?: CareerAnalysisUpdateOneRequiredWithoutRoadmapNestedInput
    tasks?: RoadmapTaskUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    weekCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: RoadmapTaskUncheckedUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapCreateManyInput = {
    id?: string
    careerAnalysisId: string
    weekCount?: number
    createdAt?: Date | string
  }

  export type RoadmapUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    weekCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTaskCreateInput = {
    id?: string
    weekNumber: number
    orderInWeek: number
    title: string
    description: string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
    roadmap: RoadmapCreateNestedOneWithoutTasksInput
    skillGap?: SkillGapCreateNestedOneWithoutTasksInput
  }

  export type RoadmapTaskUncheckedCreateInput = {
    id?: string
    roadmapId: string
    skillGapId?: string | null
    weekNumber: number
    orderInWeek: number
    title: string
    description: string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RoadmapTaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    orderInWeek?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadmap?: RoadmapUpdateOneRequiredWithoutTasksNestedInput
    skillGap?: SkillGapUpdateOneWithoutTasksNestedInput
  }

  export type RoadmapTaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    skillGapId?: NullableStringFieldUpdateOperationsInput | string | null
    weekNumber?: IntFieldUpdateOperationsInput | number
    orderInWeek?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTaskCreateManyInput = {
    id?: string
    roadmapId: string
    skillGapId?: string | null
    weekNumber: number
    orderInWeek: number
    title: string
    description: string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RoadmapTaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    orderInWeek?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    skillGapId?: NullableStringFieldUpdateOperationsInput | string | null
    weekNumber?: IntFieldUpdateOperationsInput | number
    orderInWeek?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisEventCreateInput = {
    id?: string
    type: $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    careerAnalysis: CareerAnalysisCreateNestedOneWithoutEventsInput
  }

  export type AnalysisEventUncheckedCreateInput = {
    id?: string
    careerAnalysisId: string
    type: $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AnalysisEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnalysisEventTypeFieldUpdateOperationsInput | $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    careerAnalysis?: CareerAnalysisUpdateOneRequiredWithoutEventsNestedInput
  }

  export type AnalysisEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    type?: EnumAnalysisEventTypeFieldUpdateOperationsInput | $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisEventCreateManyInput = {
    id?: string
    careerAnalysisId: string
    type: $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AnalysisEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnalysisEventTypeFieldUpdateOperationsInput | $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    type?: EnumAnalysisEventTypeFieldUpdateOperationsInput | $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ResumeListRelationFilter = {
    every?: ResumeWhereInput
    some?: ResumeWhereInput
    none?: ResumeWhereInput
  }

  export type RefreshTokenListRelationFilter = {
    every?: RefreshTokenWhereInput
    some?: RefreshTokenWhereInput
    none?: RefreshTokenWhereInput
  }

  export type CareerAnalysisListRelationFilter = {
    every?: CareerAnalysisWhereInput
    some?: CareerAnalysisWhereInput
    none?: CareerAnalysisWhereInput
  }

  export type ResumeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CareerAnalysisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    familyId?: SortOrder
    tokenHash?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type RefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    familyId?: SortOrder
    tokenHash?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type RefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    familyId?: SortOrder
    tokenHash?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ResumeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    originalFileName?: SortOrder
    mimeType?: SortOrder
    fileSize?: SortOrder
    fileUrl?: SortOrder
    filePath?: SortOrder
    rawText?: SortOrder
    structuredResume?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeAvgOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type ResumeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    originalFileName?: SortOrder
    mimeType?: SortOrder
    fileSize?: SortOrder
    fileUrl?: SortOrder
    filePath?: SortOrder
    rawText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    originalFileName?: SortOrder
    mimeType?: SortOrder
    fileSize?: SortOrder
    fileUrl?: SortOrder
    filePath?: SortOrder
    rawText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeSumOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type RoleSkillRequirementListRelationFilter = {
    every?: RoleSkillRequirementWhereInput
    some?: RoleSkillRequirementWhereInput
    none?: RoleSkillRequirementWhereInput
  }

  export type CandidateSkillEvidenceListRelationFilter = {
    every?: CandidateSkillEvidenceWhereInput
    some?: CandidateSkillEvidenceWhereInput
    none?: CandidateSkillEvidenceWhereInput
  }

  export type SkillGapListRelationFilter = {
    every?: SkillGapWhereInput
    some?: SkillGapWhereInput
    none?: SkillGapWhereInput
  }

  export type RoleSkillRequirementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CandidateSkillEvidenceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SkillGapOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SkillCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    aliases?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    seedVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    seedVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    seedVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumSkillImportanceFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillImportance | EnumSkillImportanceFieldRefInput<$PrismaModel>
    in?: $Enums.SkillImportance[] | ListEnumSkillImportanceFieldRefInput<$PrismaModel>
    notIn?: $Enums.SkillImportance[] | ListEnumSkillImportanceFieldRefInput<$PrismaModel>
    not?: NestedEnumSkillImportanceFilter<$PrismaModel> | $Enums.SkillImportance
  }

  export type RoleScalarRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type SkillScalarRelationFilter = {
    is?: SkillWhereInput
    isNot?: SkillWhereInput
  }

  export type RoleSkillRequirementRoleIdSkillIdCompoundUniqueInput = {
    roleId: string
    skillId: string
  }

  export type RoleSkillRequirementCountOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    skillId?: SortOrder
    importance?: SortOrder
    rationale?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleSkillRequirementMaxOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    skillId?: SortOrder
    importance?: SortOrder
    rationale?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleSkillRequirementMinOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    skillId?: SortOrder
    importance?: SortOrder
    rationale?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumSkillImportanceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillImportance | EnumSkillImportanceFieldRefInput<$PrismaModel>
    in?: $Enums.SkillImportance[] | ListEnumSkillImportanceFieldRefInput<$PrismaModel>
    notIn?: $Enums.SkillImportance[] | ListEnumSkillImportanceFieldRefInput<$PrismaModel>
    not?: NestedEnumSkillImportanceWithAggregatesFilter<$PrismaModel> | $Enums.SkillImportance
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSkillImportanceFilter<$PrismaModel>
    _max?: NestedEnumSkillImportanceFilter<$PrismaModel>
  }

  export type EnumCareerAnalysisStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CareerAnalysisStatus | EnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CareerAnalysisStatus[] | ListEnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CareerAnalysisStatus[] | ListEnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCareerAnalysisStatusFilter<$PrismaModel> | $Enums.CareerAnalysisStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ResumeScalarRelationFilter = {
    is?: ResumeWhereInput
    isNot?: ResumeWhereInput
  }

  export type RoadmapNullableScalarRelationFilter = {
    is?: RoadmapWhereInput | null
    isNot?: RoadmapWhereInput | null
  }

  export type AnalysisEventListRelationFilter = {
    every?: AnalysisEventWhereInput
    some?: AnalysisEventWhereInput
    none?: AnalysisEventWhereInput
  }

  export type AnalysisEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CareerAnalysisCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    resumeId?: SortOrder
    roleId?: SortOrder
    resumeSnapshot?: SortOrder
    roleSnapshot?: SortOrder
    readinessScore?: SortOrder
    readinessBreakdown?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type CareerAnalysisAvgOrderByAggregateInput = {
    readinessScore?: SortOrder
  }

  export type CareerAnalysisMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    resumeId?: SortOrder
    roleId?: SortOrder
    readinessScore?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type CareerAnalysisMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    resumeId?: SortOrder
    roleId?: SortOrder
    readinessScore?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type CareerAnalysisSumOrderByAggregateInput = {
    readinessScore?: SortOrder
  }

  export type EnumCareerAnalysisStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CareerAnalysisStatus | EnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CareerAnalysisStatus[] | ListEnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CareerAnalysisStatus[] | ListEnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCareerAnalysisStatusWithAggregatesFilter<$PrismaModel> | $Enums.CareerAnalysisStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCareerAnalysisStatusFilter<$PrismaModel>
    _max?: NestedEnumCareerAnalysisStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumEvidenceStrengthFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceStrength | EnumEvidenceStrengthFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceStrength[] | ListEnumEvidenceStrengthFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceStrength[] | ListEnumEvidenceStrengthFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceStrengthFilter<$PrismaModel> | $Enums.EvidenceStrength
  }

  export type CareerAnalysisScalarRelationFilter = {
    is?: CareerAnalysisWhereInput
    isNot?: CareerAnalysisWhereInput
  }

  export type CandidateSkillEvidenceCountOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    skillId?: SortOrder
    strength?: SortOrder
    quote?: SortOrder
    sourceSection?: SortOrder
    sourceLabel?: SortOrder
    createdAt?: SortOrder
  }

  export type CandidateSkillEvidenceMaxOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    skillId?: SortOrder
    strength?: SortOrder
    quote?: SortOrder
    sourceSection?: SortOrder
    sourceLabel?: SortOrder
    createdAt?: SortOrder
  }

  export type CandidateSkillEvidenceMinOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    skillId?: SortOrder
    strength?: SortOrder
    quote?: SortOrder
    sourceSection?: SortOrder
    sourceLabel?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumEvidenceStrengthWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceStrength | EnumEvidenceStrengthFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceStrength[] | ListEnumEvidenceStrengthFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceStrength[] | ListEnumEvidenceStrengthFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceStrengthWithAggregatesFilter<$PrismaModel> | $Enums.EvidenceStrength
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEvidenceStrengthFilter<$PrismaModel>
    _max?: NestedEnumEvidenceStrengthFilter<$PrismaModel>
  }

  export type EnumGapStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GapStatus | EnumGapStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GapStatus[] | ListEnumGapStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GapStatus[] | ListEnumGapStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGapStatusFilter<$PrismaModel> | $Enums.GapStatus
  }

  export type RoadmapTaskListRelationFilter = {
    every?: RoadmapTaskWhereInput
    some?: RoadmapTaskWhereInput
    none?: RoadmapTaskWhereInput
  }

  export type RoadmapTaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SkillGapCareerAnalysisIdSkillIdCompoundUniqueInput = {
    careerAnalysisId: string
    skillId: string
  }

  export type SkillGapCountOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    skillId?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    reasoning?: SortOrder
    createdAt?: SortOrder
  }

  export type SkillGapAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type SkillGapMaxOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    skillId?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    reasoning?: SortOrder
    createdAt?: SortOrder
  }

  export type SkillGapMinOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    skillId?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    reasoning?: SortOrder
    createdAt?: SortOrder
  }

  export type SkillGapSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type EnumGapStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GapStatus | EnumGapStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GapStatus[] | ListEnumGapStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GapStatus[] | ListEnumGapStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGapStatusWithAggregatesFilter<$PrismaModel> | $Enums.GapStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGapStatusFilter<$PrismaModel>
    _max?: NestedEnumGapStatusFilter<$PrismaModel>
  }

  export type RoadmapCountOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    weekCount?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapAvgOrderByAggregateInput = {
    weekCount?: SortOrder
  }

  export type RoadmapMaxOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    weekCount?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapMinOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    weekCount?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapSumOrderByAggregateInput = {
    weekCount?: SortOrder
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type RoadmapScalarRelationFilter = {
    is?: RoadmapWhereInput
    isNot?: RoadmapWhereInput
  }

  export type SkillGapNullableScalarRelationFilter = {
    is?: SkillGapWhereInput | null
    isNot?: SkillGapWhereInput | null
  }

  export type RoadmapTaskCountOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    skillGapId?: SortOrder
    weekNumber?: SortOrder
    orderInWeek?: SortOrder
    title?: SortOrder
    description?: SortOrder
    resources?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapTaskAvgOrderByAggregateInput = {
    weekNumber?: SortOrder
    orderInWeek?: SortOrder
  }

  export type RoadmapTaskMaxOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    skillGapId?: SortOrder
    weekNumber?: SortOrder
    orderInWeek?: SortOrder
    title?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapTaskMinOrderByAggregateInput = {
    id?: SortOrder
    roadmapId?: SortOrder
    skillGapId?: SortOrder
    weekNumber?: SortOrder
    orderInWeek?: SortOrder
    title?: SortOrder
    description?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RoadmapTaskSumOrderByAggregateInput = {
    weekNumber?: SortOrder
    orderInWeek?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumAnalysisEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AnalysisEventType | EnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnalysisEventType[] | ListEnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnalysisEventType[] | ListEnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnalysisEventTypeFilter<$PrismaModel> | $Enums.AnalysisEventType
  }

  export type AnalysisEventCountOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    type?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisEventMaxOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisEventMinOrderByAggregateInput = {
    id?: SortOrder
    careerAnalysisId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumAnalysisEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AnalysisEventType | EnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnalysisEventType[] | ListEnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnalysisEventType[] | ListEnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnalysisEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.AnalysisEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAnalysisEventTypeFilter<$PrismaModel>
    _max?: NestedEnumAnalysisEventTypeFilter<$PrismaModel>
  }

  export type ResumeCreateNestedManyWithoutUserInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
  }

  export type RefreshTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type CareerAnalysisCreateNestedManyWithoutUserInput = {
    create?: XOR<CareerAnalysisCreateWithoutUserInput, CareerAnalysisUncheckedCreateWithoutUserInput> | CareerAnalysisCreateWithoutUserInput[] | CareerAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutUserInput | CareerAnalysisCreateOrConnectWithoutUserInput[]
    createMany?: CareerAnalysisCreateManyUserInputEnvelope
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
  }

  export type ResumeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
  }

  export type RefreshTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type CareerAnalysisUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CareerAnalysisCreateWithoutUserInput, CareerAnalysisUncheckedCreateWithoutUserInput> | CareerAnalysisCreateWithoutUserInput[] | CareerAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutUserInput | CareerAnalysisCreateOrConnectWithoutUserInput[]
    createMany?: CareerAnalysisCreateManyUserInputEnvelope
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ResumeUpdateManyWithoutUserNestedInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    upsert?: ResumeUpsertWithWhereUniqueWithoutUserInput | ResumeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    set?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    disconnect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    delete?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    update?: ResumeUpdateWithWhereUniqueWithoutUserInput | ResumeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ResumeUpdateManyWithWhereWithoutUserInput | ResumeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
  }

  export type RefreshTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type CareerAnalysisUpdateManyWithoutUserNestedInput = {
    create?: XOR<CareerAnalysisCreateWithoutUserInput, CareerAnalysisUncheckedCreateWithoutUserInput> | CareerAnalysisCreateWithoutUserInput[] | CareerAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutUserInput | CareerAnalysisCreateOrConnectWithoutUserInput[]
    upsert?: CareerAnalysisUpsertWithWhereUniqueWithoutUserInput | CareerAnalysisUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CareerAnalysisCreateManyUserInputEnvelope
    set?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    disconnect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    delete?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    update?: CareerAnalysisUpdateWithWhereUniqueWithoutUserInput | CareerAnalysisUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CareerAnalysisUpdateManyWithWhereWithoutUserInput | CareerAnalysisUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CareerAnalysisScalarWhereInput | CareerAnalysisScalarWhereInput[]
  }

  export type ResumeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    upsert?: ResumeUpsertWithWhereUniqueWithoutUserInput | ResumeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    set?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    disconnect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    delete?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    update?: ResumeUpdateWithWhereUniqueWithoutUserInput | ResumeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ResumeUpdateManyWithWhereWithoutUserInput | ResumeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type CareerAnalysisUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CareerAnalysisCreateWithoutUserInput, CareerAnalysisUncheckedCreateWithoutUserInput> | CareerAnalysisCreateWithoutUserInput[] | CareerAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutUserInput | CareerAnalysisCreateOrConnectWithoutUserInput[]
    upsert?: CareerAnalysisUpsertWithWhereUniqueWithoutUserInput | CareerAnalysisUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CareerAnalysisCreateManyUserInputEnvelope
    set?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    disconnect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    delete?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    update?: CareerAnalysisUpdateWithWhereUniqueWithoutUserInput | CareerAnalysisUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CareerAnalysisUpdateManyWithWhereWithoutUserInput | CareerAnalysisUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CareerAnalysisScalarWhereInput | CareerAnalysisScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRefreshTokensInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    upsert?: UserUpsertWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefreshTokensInput, UserUpdateWithoutRefreshTokensInput>, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserCreateNestedOneWithoutResumesInput = {
    create?: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
    connectOrCreate?: UserCreateOrConnectWithoutResumesInput
    connect?: UserWhereUniqueInput
  }

  export type CareerAnalysisCreateNestedManyWithoutResumeInput = {
    create?: XOR<CareerAnalysisCreateWithoutResumeInput, CareerAnalysisUncheckedCreateWithoutResumeInput> | CareerAnalysisCreateWithoutResumeInput[] | CareerAnalysisUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutResumeInput | CareerAnalysisCreateOrConnectWithoutResumeInput[]
    createMany?: CareerAnalysisCreateManyResumeInputEnvelope
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
  }

  export type CareerAnalysisUncheckedCreateNestedManyWithoutResumeInput = {
    create?: XOR<CareerAnalysisCreateWithoutResumeInput, CareerAnalysisUncheckedCreateWithoutResumeInput> | CareerAnalysisCreateWithoutResumeInput[] | CareerAnalysisUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutResumeInput | CareerAnalysisCreateOrConnectWithoutResumeInput[]
    createMany?: CareerAnalysisCreateManyResumeInputEnvelope
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneRequiredWithoutResumesNestedInput = {
    create?: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
    connectOrCreate?: UserCreateOrConnectWithoutResumesInput
    upsert?: UserUpsertWithoutResumesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutResumesInput, UserUpdateWithoutResumesInput>, UserUncheckedUpdateWithoutResumesInput>
  }

  export type CareerAnalysisUpdateManyWithoutResumeNestedInput = {
    create?: XOR<CareerAnalysisCreateWithoutResumeInput, CareerAnalysisUncheckedCreateWithoutResumeInput> | CareerAnalysisCreateWithoutResumeInput[] | CareerAnalysisUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutResumeInput | CareerAnalysisCreateOrConnectWithoutResumeInput[]
    upsert?: CareerAnalysisUpsertWithWhereUniqueWithoutResumeInput | CareerAnalysisUpsertWithWhereUniqueWithoutResumeInput[]
    createMany?: CareerAnalysisCreateManyResumeInputEnvelope
    set?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    disconnect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    delete?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    update?: CareerAnalysisUpdateWithWhereUniqueWithoutResumeInput | CareerAnalysisUpdateWithWhereUniqueWithoutResumeInput[]
    updateMany?: CareerAnalysisUpdateManyWithWhereWithoutResumeInput | CareerAnalysisUpdateManyWithWhereWithoutResumeInput[]
    deleteMany?: CareerAnalysisScalarWhereInput | CareerAnalysisScalarWhereInput[]
  }

  export type CareerAnalysisUncheckedUpdateManyWithoutResumeNestedInput = {
    create?: XOR<CareerAnalysisCreateWithoutResumeInput, CareerAnalysisUncheckedCreateWithoutResumeInput> | CareerAnalysisCreateWithoutResumeInput[] | CareerAnalysisUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutResumeInput | CareerAnalysisCreateOrConnectWithoutResumeInput[]
    upsert?: CareerAnalysisUpsertWithWhereUniqueWithoutResumeInput | CareerAnalysisUpsertWithWhereUniqueWithoutResumeInput[]
    createMany?: CareerAnalysisCreateManyResumeInputEnvelope
    set?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    disconnect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    delete?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    update?: CareerAnalysisUpdateWithWhereUniqueWithoutResumeInput | CareerAnalysisUpdateWithWhereUniqueWithoutResumeInput[]
    updateMany?: CareerAnalysisUpdateManyWithWhereWithoutResumeInput | CareerAnalysisUpdateManyWithWhereWithoutResumeInput[]
    deleteMany?: CareerAnalysisScalarWhereInput | CareerAnalysisScalarWhereInput[]
  }

  export type SkillCreatealiasesInput = {
    set: string[]
  }

  export type RoleSkillRequirementCreateNestedManyWithoutSkillInput = {
    create?: XOR<RoleSkillRequirementCreateWithoutSkillInput, RoleSkillRequirementUncheckedCreateWithoutSkillInput> | RoleSkillRequirementCreateWithoutSkillInput[] | RoleSkillRequirementUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: RoleSkillRequirementCreateOrConnectWithoutSkillInput | RoleSkillRequirementCreateOrConnectWithoutSkillInput[]
    createMany?: RoleSkillRequirementCreateManySkillInputEnvelope
    connect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
  }

  export type CandidateSkillEvidenceCreateNestedManyWithoutSkillInput = {
    create?: XOR<CandidateSkillEvidenceCreateWithoutSkillInput, CandidateSkillEvidenceUncheckedCreateWithoutSkillInput> | CandidateSkillEvidenceCreateWithoutSkillInput[] | CandidateSkillEvidenceUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: CandidateSkillEvidenceCreateOrConnectWithoutSkillInput | CandidateSkillEvidenceCreateOrConnectWithoutSkillInput[]
    createMany?: CandidateSkillEvidenceCreateManySkillInputEnvelope
    connect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
  }

  export type SkillGapCreateNestedManyWithoutSkillInput = {
    create?: XOR<SkillGapCreateWithoutSkillInput, SkillGapUncheckedCreateWithoutSkillInput> | SkillGapCreateWithoutSkillInput[] | SkillGapUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: SkillGapCreateOrConnectWithoutSkillInput | SkillGapCreateOrConnectWithoutSkillInput[]
    createMany?: SkillGapCreateManySkillInputEnvelope
    connect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
  }

  export type RoleSkillRequirementUncheckedCreateNestedManyWithoutSkillInput = {
    create?: XOR<RoleSkillRequirementCreateWithoutSkillInput, RoleSkillRequirementUncheckedCreateWithoutSkillInput> | RoleSkillRequirementCreateWithoutSkillInput[] | RoleSkillRequirementUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: RoleSkillRequirementCreateOrConnectWithoutSkillInput | RoleSkillRequirementCreateOrConnectWithoutSkillInput[]
    createMany?: RoleSkillRequirementCreateManySkillInputEnvelope
    connect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
  }

  export type CandidateSkillEvidenceUncheckedCreateNestedManyWithoutSkillInput = {
    create?: XOR<CandidateSkillEvidenceCreateWithoutSkillInput, CandidateSkillEvidenceUncheckedCreateWithoutSkillInput> | CandidateSkillEvidenceCreateWithoutSkillInput[] | CandidateSkillEvidenceUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: CandidateSkillEvidenceCreateOrConnectWithoutSkillInput | CandidateSkillEvidenceCreateOrConnectWithoutSkillInput[]
    createMany?: CandidateSkillEvidenceCreateManySkillInputEnvelope
    connect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
  }

  export type SkillGapUncheckedCreateNestedManyWithoutSkillInput = {
    create?: XOR<SkillGapCreateWithoutSkillInput, SkillGapUncheckedCreateWithoutSkillInput> | SkillGapCreateWithoutSkillInput[] | SkillGapUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: SkillGapCreateOrConnectWithoutSkillInput | SkillGapCreateOrConnectWithoutSkillInput[]
    createMany?: SkillGapCreateManySkillInputEnvelope
    connect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
  }

  export type SkillUpdatealiasesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type RoleSkillRequirementUpdateManyWithoutSkillNestedInput = {
    create?: XOR<RoleSkillRequirementCreateWithoutSkillInput, RoleSkillRequirementUncheckedCreateWithoutSkillInput> | RoleSkillRequirementCreateWithoutSkillInput[] | RoleSkillRequirementUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: RoleSkillRequirementCreateOrConnectWithoutSkillInput | RoleSkillRequirementCreateOrConnectWithoutSkillInput[]
    upsert?: RoleSkillRequirementUpsertWithWhereUniqueWithoutSkillInput | RoleSkillRequirementUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: RoleSkillRequirementCreateManySkillInputEnvelope
    set?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    disconnect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    delete?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    connect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    update?: RoleSkillRequirementUpdateWithWhereUniqueWithoutSkillInput | RoleSkillRequirementUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: RoleSkillRequirementUpdateManyWithWhereWithoutSkillInput | RoleSkillRequirementUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: RoleSkillRequirementScalarWhereInput | RoleSkillRequirementScalarWhereInput[]
  }

  export type CandidateSkillEvidenceUpdateManyWithoutSkillNestedInput = {
    create?: XOR<CandidateSkillEvidenceCreateWithoutSkillInput, CandidateSkillEvidenceUncheckedCreateWithoutSkillInput> | CandidateSkillEvidenceCreateWithoutSkillInput[] | CandidateSkillEvidenceUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: CandidateSkillEvidenceCreateOrConnectWithoutSkillInput | CandidateSkillEvidenceCreateOrConnectWithoutSkillInput[]
    upsert?: CandidateSkillEvidenceUpsertWithWhereUniqueWithoutSkillInput | CandidateSkillEvidenceUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: CandidateSkillEvidenceCreateManySkillInputEnvelope
    set?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    disconnect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    delete?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    connect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    update?: CandidateSkillEvidenceUpdateWithWhereUniqueWithoutSkillInput | CandidateSkillEvidenceUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: CandidateSkillEvidenceUpdateManyWithWhereWithoutSkillInput | CandidateSkillEvidenceUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: CandidateSkillEvidenceScalarWhereInput | CandidateSkillEvidenceScalarWhereInput[]
  }

  export type SkillGapUpdateManyWithoutSkillNestedInput = {
    create?: XOR<SkillGapCreateWithoutSkillInput, SkillGapUncheckedCreateWithoutSkillInput> | SkillGapCreateWithoutSkillInput[] | SkillGapUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: SkillGapCreateOrConnectWithoutSkillInput | SkillGapCreateOrConnectWithoutSkillInput[]
    upsert?: SkillGapUpsertWithWhereUniqueWithoutSkillInput | SkillGapUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: SkillGapCreateManySkillInputEnvelope
    set?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    disconnect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    delete?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    connect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    update?: SkillGapUpdateWithWhereUniqueWithoutSkillInput | SkillGapUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: SkillGapUpdateManyWithWhereWithoutSkillInput | SkillGapUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: SkillGapScalarWhereInput | SkillGapScalarWhereInput[]
  }

  export type RoleSkillRequirementUncheckedUpdateManyWithoutSkillNestedInput = {
    create?: XOR<RoleSkillRequirementCreateWithoutSkillInput, RoleSkillRequirementUncheckedCreateWithoutSkillInput> | RoleSkillRequirementCreateWithoutSkillInput[] | RoleSkillRequirementUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: RoleSkillRequirementCreateOrConnectWithoutSkillInput | RoleSkillRequirementCreateOrConnectWithoutSkillInput[]
    upsert?: RoleSkillRequirementUpsertWithWhereUniqueWithoutSkillInput | RoleSkillRequirementUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: RoleSkillRequirementCreateManySkillInputEnvelope
    set?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    disconnect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    delete?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    connect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    update?: RoleSkillRequirementUpdateWithWhereUniqueWithoutSkillInput | RoleSkillRequirementUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: RoleSkillRequirementUpdateManyWithWhereWithoutSkillInput | RoleSkillRequirementUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: RoleSkillRequirementScalarWhereInput | RoleSkillRequirementScalarWhereInput[]
  }

  export type CandidateSkillEvidenceUncheckedUpdateManyWithoutSkillNestedInput = {
    create?: XOR<CandidateSkillEvidenceCreateWithoutSkillInput, CandidateSkillEvidenceUncheckedCreateWithoutSkillInput> | CandidateSkillEvidenceCreateWithoutSkillInput[] | CandidateSkillEvidenceUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: CandidateSkillEvidenceCreateOrConnectWithoutSkillInput | CandidateSkillEvidenceCreateOrConnectWithoutSkillInput[]
    upsert?: CandidateSkillEvidenceUpsertWithWhereUniqueWithoutSkillInput | CandidateSkillEvidenceUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: CandidateSkillEvidenceCreateManySkillInputEnvelope
    set?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    disconnect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    delete?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    connect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    update?: CandidateSkillEvidenceUpdateWithWhereUniqueWithoutSkillInput | CandidateSkillEvidenceUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: CandidateSkillEvidenceUpdateManyWithWhereWithoutSkillInput | CandidateSkillEvidenceUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: CandidateSkillEvidenceScalarWhereInput | CandidateSkillEvidenceScalarWhereInput[]
  }

  export type SkillGapUncheckedUpdateManyWithoutSkillNestedInput = {
    create?: XOR<SkillGapCreateWithoutSkillInput, SkillGapUncheckedCreateWithoutSkillInput> | SkillGapCreateWithoutSkillInput[] | SkillGapUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: SkillGapCreateOrConnectWithoutSkillInput | SkillGapCreateOrConnectWithoutSkillInput[]
    upsert?: SkillGapUpsertWithWhereUniqueWithoutSkillInput | SkillGapUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: SkillGapCreateManySkillInputEnvelope
    set?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    disconnect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    delete?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    connect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    update?: SkillGapUpdateWithWhereUniqueWithoutSkillInput | SkillGapUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: SkillGapUpdateManyWithWhereWithoutSkillInput | SkillGapUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: SkillGapScalarWhereInput | SkillGapScalarWhereInput[]
  }

  export type RoleSkillRequirementCreateNestedManyWithoutRoleInput = {
    create?: XOR<RoleSkillRequirementCreateWithoutRoleInput, RoleSkillRequirementUncheckedCreateWithoutRoleInput> | RoleSkillRequirementCreateWithoutRoleInput[] | RoleSkillRequirementUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleSkillRequirementCreateOrConnectWithoutRoleInput | RoleSkillRequirementCreateOrConnectWithoutRoleInput[]
    createMany?: RoleSkillRequirementCreateManyRoleInputEnvelope
    connect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
  }

  export type CareerAnalysisCreateNestedManyWithoutRoleInput = {
    create?: XOR<CareerAnalysisCreateWithoutRoleInput, CareerAnalysisUncheckedCreateWithoutRoleInput> | CareerAnalysisCreateWithoutRoleInput[] | CareerAnalysisUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutRoleInput | CareerAnalysisCreateOrConnectWithoutRoleInput[]
    createMany?: CareerAnalysisCreateManyRoleInputEnvelope
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
  }

  export type RoleSkillRequirementUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<RoleSkillRequirementCreateWithoutRoleInput, RoleSkillRequirementUncheckedCreateWithoutRoleInput> | RoleSkillRequirementCreateWithoutRoleInput[] | RoleSkillRequirementUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleSkillRequirementCreateOrConnectWithoutRoleInput | RoleSkillRequirementCreateOrConnectWithoutRoleInput[]
    createMany?: RoleSkillRequirementCreateManyRoleInputEnvelope
    connect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
  }

  export type CareerAnalysisUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<CareerAnalysisCreateWithoutRoleInput, CareerAnalysisUncheckedCreateWithoutRoleInput> | CareerAnalysisCreateWithoutRoleInput[] | CareerAnalysisUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutRoleInput | CareerAnalysisCreateOrConnectWithoutRoleInput[]
    createMany?: CareerAnalysisCreateManyRoleInputEnvelope
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
  }

  export type RoleSkillRequirementUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RoleSkillRequirementCreateWithoutRoleInput, RoleSkillRequirementUncheckedCreateWithoutRoleInput> | RoleSkillRequirementCreateWithoutRoleInput[] | RoleSkillRequirementUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleSkillRequirementCreateOrConnectWithoutRoleInput | RoleSkillRequirementCreateOrConnectWithoutRoleInput[]
    upsert?: RoleSkillRequirementUpsertWithWhereUniqueWithoutRoleInput | RoleSkillRequirementUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RoleSkillRequirementCreateManyRoleInputEnvelope
    set?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    disconnect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    delete?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    connect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    update?: RoleSkillRequirementUpdateWithWhereUniqueWithoutRoleInput | RoleSkillRequirementUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RoleSkillRequirementUpdateManyWithWhereWithoutRoleInput | RoleSkillRequirementUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RoleSkillRequirementScalarWhereInput | RoleSkillRequirementScalarWhereInput[]
  }

  export type CareerAnalysisUpdateManyWithoutRoleNestedInput = {
    create?: XOR<CareerAnalysisCreateWithoutRoleInput, CareerAnalysisUncheckedCreateWithoutRoleInput> | CareerAnalysisCreateWithoutRoleInput[] | CareerAnalysisUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutRoleInput | CareerAnalysisCreateOrConnectWithoutRoleInput[]
    upsert?: CareerAnalysisUpsertWithWhereUniqueWithoutRoleInput | CareerAnalysisUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: CareerAnalysisCreateManyRoleInputEnvelope
    set?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    disconnect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    delete?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    update?: CareerAnalysisUpdateWithWhereUniqueWithoutRoleInput | CareerAnalysisUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: CareerAnalysisUpdateManyWithWhereWithoutRoleInput | CareerAnalysisUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: CareerAnalysisScalarWhereInput | CareerAnalysisScalarWhereInput[]
  }

  export type RoleSkillRequirementUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RoleSkillRequirementCreateWithoutRoleInput, RoleSkillRequirementUncheckedCreateWithoutRoleInput> | RoleSkillRequirementCreateWithoutRoleInput[] | RoleSkillRequirementUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleSkillRequirementCreateOrConnectWithoutRoleInput | RoleSkillRequirementCreateOrConnectWithoutRoleInput[]
    upsert?: RoleSkillRequirementUpsertWithWhereUniqueWithoutRoleInput | RoleSkillRequirementUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RoleSkillRequirementCreateManyRoleInputEnvelope
    set?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    disconnect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    delete?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    connect?: RoleSkillRequirementWhereUniqueInput | RoleSkillRequirementWhereUniqueInput[]
    update?: RoleSkillRequirementUpdateWithWhereUniqueWithoutRoleInput | RoleSkillRequirementUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RoleSkillRequirementUpdateManyWithWhereWithoutRoleInput | RoleSkillRequirementUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RoleSkillRequirementScalarWhereInput | RoleSkillRequirementScalarWhereInput[]
  }

  export type CareerAnalysisUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<CareerAnalysisCreateWithoutRoleInput, CareerAnalysisUncheckedCreateWithoutRoleInput> | CareerAnalysisCreateWithoutRoleInput[] | CareerAnalysisUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutRoleInput | CareerAnalysisCreateOrConnectWithoutRoleInput[]
    upsert?: CareerAnalysisUpsertWithWhereUniqueWithoutRoleInput | CareerAnalysisUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: CareerAnalysisCreateManyRoleInputEnvelope
    set?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    disconnect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    delete?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    connect?: CareerAnalysisWhereUniqueInput | CareerAnalysisWhereUniqueInput[]
    update?: CareerAnalysisUpdateWithWhereUniqueWithoutRoleInput | CareerAnalysisUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: CareerAnalysisUpdateManyWithWhereWithoutRoleInput | CareerAnalysisUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: CareerAnalysisScalarWhereInput | CareerAnalysisScalarWhereInput[]
  }

  export type RoleCreateNestedOneWithoutRequirementsInput = {
    create?: XOR<RoleCreateWithoutRequirementsInput, RoleUncheckedCreateWithoutRequirementsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutRequirementsInput
    connect?: RoleWhereUniqueInput
  }

  export type SkillCreateNestedOneWithoutRequirementsInput = {
    create?: XOR<SkillCreateWithoutRequirementsInput, SkillUncheckedCreateWithoutRequirementsInput>
    connectOrCreate?: SkillCreateOrConnectWithoutRequirementsInput
    connect?: SkillWhereUniqueInput
  }

  export type EnumSkillImportanceFieldUpdateOperationsInput = {
    set?: $Enums.SkillImportance
  }

  export type RoleUpdateOneRequiredWithoutRequirementsNestedInput = {
    create?: XOR<RoleCreateWithoutRequirementsInput, RoleUncheckedCreateWithoutRequirementsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutRequirementsInput
    upsert?: RoleUpsertWithoutRequirementsInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutRequirementsInput, RoleUpdateWithoutRequirementsInput>, RoleUncheckedUpdateWithoutRequirementsInput>
  }

  export type SkillUpdateOneRequiredWithoutRequirementsNestedInput = {
    create?: XOR<SkillCreateWithoutRequirementsInput, SkillUncheckedCreateWithoutRequirementsInput>
    connectOrCreate?: SkillCreateOrConnectWithoutRequirementsInput
    upsert?: SkillUpsertWithoutRequirementsInput
    connect?: SkillWhereUniqueInput
    update?: XOR<XOR<SkillUpdateToOneWithWhereWithoutRequirementsInput, SkillUpdateWithoutRequirementsInput>, SkillUncheckedUpdateWithoutRequirementsInput>
  }

  export type UserCreateNestedOneWithoutAnalysesInput = {
    create?: XOR<UserCreateWithoutAnalysesInput, UserUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnalysesInput
    connect?: UserWhereUniqueInput
  }

  export type ResumeCreateNestedOneWithoutAnalysesInput = {
    create?: XOR<ResumeCreateWithoutAnalysesInput, ResumeUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: ResumeCreateOrConnectWithoutAnalysesInput
    connect?: ResumeWhereUniqueInput
  }

  export type RoleCreateNestedOneWithoutAnalysesInput = {
    create?: XOR<RoleCreateWithoutAnalysesInput, RoleUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutAnalysesInput
    connect?: RoleWhereUniqueInput
  }

  export type CandidateSkillEvidenceCreateNestedManyWithoutCareerAnalysisInput = {
    create?: XOR<CandidateSkillEvidenceCreateWithoutCareerAnalysisInput, CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput> | CandidateSkillEvidenceCreateWithoutCareerAnalysisInput[] | CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: CandidateSkillEvidenceCreateOrConnectWithoutCareerAnalysisInput | CandidateSkillEvidenceCreateOrConnectWithoutCareerAnalysisInput[]
    createMany?: CandidateSkillEvidenceCreateManyCareerAnalysisInputEnvelope
    connect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
  }

  export type SkillGapCreateNestedManyWithoutCareerAnalysisInput = {
    create?: XOR<SkillGapCreateWithoutCareerAnalysisInput, SkillGapUncheckedCreateWithoutCareerAnalysisInput> | SkillGapCreateWithoutCareerAnalysisInput[] | SkillGapUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: SkillGapCreateOrConnectWithoutCareerAnalysisInput | SkillGapCreateOrConnectWithoutCareerAnalysisInput[]
    createMany?: SkillGapCreateManyCareerAnalysisInputEnvelope
    connect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
  }

  export type RoadmapCreateNestedOneWithoutCareerAnalysisInput = {
    create?: XOR<RoadmapCreateWithoutCareerAnalysisInput, RoadmapUncheckedCreateWithoutCareerAnalysisInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutCareerAnalysisInput
    connect?: RoadmapWhereUniqueInput
  }

  export type AnalysisEventCreateNestedManyWithoutCareerAnalysisInput = {
    create?: XOR<AnalysisEventCreateWithoutCareerAnalysisInput, AnalysisEventUncheckedCreateWithoutCareerAnalysisInput> | AnalysisEventCreateWithoutCareerAnalysisInput[] | AnalysisEventUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: AnalysisEventCreateOrConnectWithoutCareerAnalysisInput | AnalysisEventCreateOrConnectWithoutCareerAnalysisInput[]
    createMany?: AnalysisEventCreateManyCareerAnalysisInputEnvelope
    connect?: AnalysisEventWhereUniqueInput | AnalysisEventWhereUniqueInput[]
  }

  export type CandidateSkillEvidenceUncheckedCreateNestedManyWithoutCareerAnalysisInput = {
    create?: XOR<CandidateSkillEvidenceCreateWithoutCareerAnalysisInput, CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput> | CandidateSkillEvidenceCreateWithoutCareerAnalysisInput[] | CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: CandidateSkillEvidenceCreateOrConnectWithoutCareerAnalysisInput | CandidateSkillEvidenceCreateOrConnectWithoutCareerAnalysisInput[]
    createMany?: CandidateSkillEvidenceCreateManyCareerAnalysisInputEnvelope
    connect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
  }

  export type SkillGapUncheckedCreateNestedManyWithoutCareerAnalysisInput = {
    create?: XOR<SkillGapCreateWithoutCareerAnalysisInput, SkillGapUncheckedCreateWithoutCareerAnalysisInput> | SkillGapCreateWithoutCareerAnalysisInput[] | SkillGapUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: SkillGapCreateOrConnectWithoutCareerAnalysisInput | SkillGapCreateOrConnectWithoutCareerAnalysisInput[]
    createMany?: SkillGapCreateManyCareerAnalysisInputEnvelope
    connect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
  }

  export type RoadmapUncheckedCreateNestedOneWithoutCareerAnalysisInput = {
    create?: XOR<RoadmapCreateWithoutCareerAnalysisInput, RoadmapUncheckedCreateWithoutCareerAnalysisInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutCareerAnalysisInput
    connect?: RoadmapWhereUniqueInput
  }

  export type AnalysisEventUncheckedCreateNestedManyWithoutCareerAnalysisInput = {
    create?: XOR<AnalysisEventCreateWithoutCareerAnalysisInput, AnalysisEventUncheckedCreateWithoutCareerAnalysisInput> | AnalysisEventCreateWithoutCareerAnalysisInput[] | AnalysisEventUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: AnalysisEventCreateOrConnectWithoutCareerAnalysisInput | AnalysisEventCreateOrConnectWithoutCareerAnalysisInput[]
    createMany?: AnalysisEventCreateManyCareerAnalysisInputEnvelope
    connect?: AnalysisEventWhereUniqueInput | AnalysisEventWhereUniqueInput[]
  }

  export type EnumCareerAnalysisStatusFieldUpdateOperationsInput = {
    set?: $Enums.CareerAnalysisStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAnalysesNestedInput = {
    create?: XOR<UserCreateWithoutAnalysesInput, UserUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAnalysesInput
    upsert?: UserUpsertWithoutAnalysesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAnalysesInput, UserUpdateWithoutAnalysesInput>, UserUncheckedUpdateWithoutAnalysesInput>
  }

  export type ResumeUpdateOneRequiredWithoutAnalysesNestedInput = {
    create?: XOR<ResumeCreateWithoutAnalysesInput, ResumeUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: ResumeCreateOrConnectWithoutAnalysesInput
    upsert?: ResumeUpsertWithoutAnalysesInput
    connect?: ResumeWhereUniqueInput
    update?: XOR<XOR<ResumeUpdateToOneWithWhereWithoutAnalysesInput, ResumeUpdateWithoutAnalysesInput>, ResumeUncheckedUpdateWithoutAnalysesInput>
  }

  export type RoleUpdateOneRequiredWithoutAnalysesNestedInput = {
    create?: XOR<RoleCreateWithoutAnalysesInput, RoleUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutAnalysesInput
    upsert?: RoleUpsertWithoutAnalysesInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutAnalysesInput, RoleUpdateWithoutAnalysesInput>, RoleUncheckedUpdateWithoutAnalysesInput>
  }

  export type CandidateSkillEvidenceUpdateManyWithoutCareerAnalysisNestedInput = {
    create?: XOR<CandidateSkillEvidenceCreateWithoutCareerAnalysisInput, CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput> | CandidateSkillEvidenceCreateWithoutCareerAnalysisInput[] | CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: CandidateSkillEvidenceCreateOrConnectWithoutCareerAnalysisInput | CandidateSkillEvidenceCreateOrConnectWithoutCareerAnalysisInput[]
    upsert?: CandidateSkillEvidenceUpsertWithWhereUniqueWithoutCareerAnalysisInput | CandidateSkillEvidenceUpsertWithWhereUniqueWithoutCareerAnalysisInput[]
    createMany?: CandidateSkillEvidenceCreateManyCareerAnalysisInputEnvelope
    set?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    disconnect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    delete?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    connect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    update?: CandidateSkillEvidenceUpdateWithWhereUniqueWithoutCareerAnalysisInput | CandidateSkillEvidenceUpdateWithWhereUniqueWithoutCareerAnalysisInput[]
    updateMany?: CandidateSkillEvidenceUpdateManyWithWhereWithoutCareerAnalysisInput | CandidateSkillEvidenceUpdateManyWithWhereWithoutCareerAnalysisInput[]
    deleteMany?: CandidateSkillEvidenceScalarWhereInput | CandidateSkillEvidenceScalarWhereInput[]
  }

  export type SkillGapUpdateManyWithoutCareerAnalysisNestedInput = {
    create?: XOR<SkillGapCreateWithoutCareerAnalysisInput, SkillGapUncheckedCreateWithoutCareerAnalysisInput> | SkillGapCreateWithoutCareerAnalysisInput[] | SkillGapUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: SkillGapCreateOrConnectWithoutCareerAnalysisInput | SkillGapCreateOrConnectWithoutCareerAnalysisInput[]
    upsert?: SkillGapUpsertWithWhereUniqueWithoutCareerAnalysisInput | SkillGapUpsertWithWhereUniqueWithoutCareerAnalysisInput[]
    createMany?: SkillGapCreateManyCareerAnalysisInputEnvelope
    set?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    disconnect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    delete?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    connect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    update?: SkillGapUpdateWithWhereUniqueWithoutCareerAnalysisInput | SkillGapUpdateWithWhereUniqueWithoutCareerAnalysisInput[]
    updateMany?: SkillGapUpdateManyWithWhereWithoutCareerAnalysisInput | SkillGapUpdateManyWithWhereWithoutCareerAnalysisInput[]
    deleteMany?: SkillGapScalarWhereInput | SkillGapScalarWhereInput[]
  }

  export type RoadmapUpdateOneWithoutCareerAnalysisNestedInput = {
    create?: XOR<RoadmapCreateWithoutCareerAnalysisInput, RoadmapUncheckedCreateWithoutCareerAnalysisInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutCareerAnalysisInput
    upsert?: RoadmapUpsertWithoutCareerAnalysisInput
    disconnect?: RoadmapWhereInput | boolean
    delete?: RoadmapWhereInput | boolean
    connect?: RoadmapWhereUniqueInput
    update?: XOR<XOR<RoadmapUpdateToOneWithWhereWithoutCareerAnalysisInput, RoadmapUpdateWithoutCareerAnalysisInput>, RoadmapUncheckedUpdateWithoutCareerAnalysisInput>
  }

  export type AnalysisEventUpdateManyWithoutCareerAnalysisNestedInput = {
    create?: XOR<AnalysisEventCreateWithoutCareerAnalysisInput, AnalysisEventUncheckedCreateWithoutCareerAnalysisInput> | AnalysisEventCreateWithoutCareerAnalysisInput[] | AnalysisEventUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: AnalysisEventCreateOrConnectWithoutCareerAnalysisInput | AnalysisEventCreateOrConnectWithoutCareerAnalysisInput[]
    upsert?: AnalysisEventUpsertWithWhereUniqueWithoutCareerAnalysisInput | AnalysisEventUpsertWithWhereUniqueWithoutCareerAnalysisInput[]
    createMany?: AnalysisEventCreateManyCareerAnalysisInputEnvelope
    set?: AnalysisEventWhereUniqueInput | AnalysisEventWhereUniqueInput[]
    disconnect?: AnalysisEventWhereUniqueInput | AnalysisEventWhereUniqueInput[]
    delete?: AnalysisEventWhereUniqueInput | AnalysisEventWhereUniqueInput[]
    connect?: AnalysisEventWhereUniqueInput | AnalysisEventWhereUniqueInput[]
    update?: AnalysisEventUpdateWithWhereUniqueWithoutCareerAnalysisInput | AnalysisEventUpdateWithWhereUniqueWithoutCareerAnalysisInput[]
    updateMany?: AnalysisEventUpdateManyWithWhereWithoutCareerAnalysisInput | AnalysisEventUpdateManyWithWhereWithoutCareerAnalysisInput[]
    deleteMany?: AnalysisEventScalarWhereInput | AnalysisEventScalarWhereInput[]
  }

  export type CandidateSkillEvidenceUncheckedUpdateManyWithoutCareerAnalysisNestedInput = {
    create?: XOR<CandidateSkillEvidenceCreateWithoutCareerAnalysisInput, CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput> | CandidateSkillEvidenceCreateWithoutCareerAnalysisInput[] | CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: CandidateSkillEvidenceCreateOrConnectWithoutCareerAnalysisInput | CandidateSkillEvidenceCreateOrConnectWithoutCareerAnalysisInput[]
    upsert?: CandidateSkillEvidenceUpsertWithWhereUniqueWithoutCareerAnalysisInput | CandidateSkillEvidenceUpsertWithWhereUniqueWithoutCareerAnalysisInput[]
    createMany?: CandidateSkillEvidenceCreateManyCareerAnalysisInputEnvelope
    set?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    disconnect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    delete?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    connect?: CandidateSkillEvidenceWhereUniqueInput | CandidateSkillEvidenceWhereUniqueInput[]
    update?: CandidateSkillEvidenceUpdateWithWhereUniqueWithoutCareerAnalysisInput | CandidateSkillEvidenceUpdateWithWhereUniqueWithoutCareerAnalysisInput[]
    updateMany?: CandidateSkillEvidenceUpdateManyWithWhereWithoutCareerAnalysisInput | CandidateSkillEvidenceUpdateManyWithWhereWithoutCareerAnalysisInput[]
    deleteMany?: CandidateSkillEvidenceScalarWhereInput | CandidateSkillEvidenceScalarWhereInput[]
  }

  export type SkillGapUncheckedUpdateManyWithoutCareerAnalysisNestedInput = {
    create?: XOR<SkillGapCreateWithoutCareerAnalysisInput, SkillGapUncheckedCreateWithoutCareerAnalysisInput> | SkillGapCreateWithoutCareerAnalysisInput[] | SkillGapUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: SkillGapCreateOrConnectWithoutCareerAnalysisInput | SkillGapCreateOrConnectWithoutCareerAnalysisInput[]
    upsert?: SkillGapUpsertWithWhereUniqueWithoutCareerAnalysisInput | SkillGapUpsertWithWhereUniqueWithoutCareerAnalysisInput[]
    createMany?: SkillGapCreateManyCareerAnalysisInputEnvelope
    set?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    disconnect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    delete?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    connect?: SkillGapWhereUniqueInput | SkillGapWhereUniqueInput[]
    update?: SkillGapUpdateWithWhereUniqueWithoutCareerAnalysisInput | SkillGapUpdateWithWhereUniqueWithoutCareerAnalysisInput[]
    updateMany?: SkillGapUpdateManyWithWhereWithoutCareerAnalysisInput | SkillGapUpdateManyWithWhereWithoutCareerAnalysisInput[]
    deleteMany?: SkillGapScalarWhereInput | SkillGapScalarWhereInput[]
  }

  export type RoadmapUncheckedUpdateOneWithoutCareerAnalysisNestedInput = {
    create?: XOR<RoadmapCreateWithoutCareerAnalysisInput, RoadmapUncheckedCreateWithoutCareerAnalysisInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutCareerAnalysisInput
    upsert?: RoadmapUpsertWithoutCareerAnalysisInput
    disconnect?: RoadmapWhereInput | boolean
    delete?: RoadmapWhereInput | boolean
    connect?: RoadmapWhereUniqueInput
    update?: XOR<XOR<RoadmapUpdateToOneWithWhereWithoutCareerAnalysisInput, RoadmapUpdateWithoutCareerAnalysisInput>, RoadmapUncheckedUpdateWithoutCareerAnalysisInput>
  }

  export type AnalysisEventUncheckedUpdateManyWithoutCareerAnalysisNestedInput = {
    create?: XOR<AnalysisEventCreateWithoutCareerAnalysisInput, AnalysisEventUncheckedCreateWithoutCareerAnalysisInput> | AnalysisEventCreateWithoutCareerAnalysisInput[] | AnalysisEventUncheckedCreateWithoutCareerAnalysisInput[]
    connectOrCreate?: AnalysisEventCreateOrConnectWithoutCareerAnalysisInput | AnalysisEventCreateOrConnectWithoutCareerAnalysisInput[]
    upsert?: AnalysisEventUpsertWithWhereUniqueWithoutCareerAnalysisInput | AnalysisEventUpsertWithWhereUniqueWithoutCareerAnalysisInput[]
    createMany?: AnalysisEventCreateManyCareerAnalysisInputEnvelope
    set?: AnalysisEventWhereUniqueInput | AnalysisEventWhereUniqueInput[]
    disconnect?: AnalysisEventWhereUniqueInput | AnalysisEventWhereUniqueInput[]
    delete?: AnalysisEventWhereUniqueInput | AnalysisEventWhereUniqueInput[]
    connect?: AnalysisEventWhereUniqueInput | AnalysisEventWhereUniqueInput[]
    update?: AnalysisEventUpdateWithWhereUniqueWithoutCareerAnalysisInput | AnalysisEventUpdateWithWhereUniqueWithoutCareerAnalysisInput[]
    updateMany?: AnalysisEventUpdateManyWithWhereWithoutCareerAnalysisInput | AnalysisEventUpdateManyWithWhereWithoutCareerAnalysisInput[]
    deleteMany?: AnalysisEventScalarWhereInput | AnalysisEventScalarWhereInput[]
  }

  export type CareerAnalysisCreateNestedOneWithoutEvidenceInput = {
    create?: XOR<CareerAnalysisCreateWithoutEvidenceInput, CareerAnalysisUncheckedCreateWithoutEvidenceInput>
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutEvidenceInput
    connect?: CareerAnalysisWhereUniqueInput
  }

  export type SkillCreateNestedOneWithoutEvidenceInput = {
    create?: XOR<SkillCreateWithoutEvidenceInput, SkillUncheckedCreateWithoutEvidenceInput>
    connectOrCreate?: SkillCreateOrConnectWithoutEvidenceInput
    connect?: SkillWhereUniqueInput
  }

  export type EnumEvidenceStrengthFieldUpdateOperationsInput = {
    set?: $Enums.EvidenceStrength
  }

  export type CareerAnalysisUpdateOneRequiredWithoutEvidenceNestedInput = {
    create?: XOR<CareerAnalysisCreateWithoutEvidenceInput, CareerAnalysisUncheckedCreateWithoutEvidenceInput>
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutEvidenceInput
    upsert?: CareerAnalysisUpsertWithoutEvidenceInput
    connect?: CareerAnalysisWhereUniqueInput
    update?: XOR<XOR<CareerAnalysisUpdateToOneWithWhereWithoutEvidenceInput, CareerAnalysisUpdateWithoutEvidenceInput>, CareerAnalysisUncheckedUpdateWithoutEvidenceInput>
  }

  export type SkillUpdateOneRequiredWithoutEvidenceNestedInput = {
    create?: XOR<SkillCreateWithoutEvidenceInput, SkillUncheckedCreateWithoutEvidenceInput>
    connectOrCreate?: SkillCreateOrConnectWithoutEvidenceInput
    upsert?: SkillUpsertWithoutEvidenceInput
    connect?: SkillWhereUniqueInput
    update?: XOR<XOR<SkillUpdateToOneWithWhereWithoutEvidenceInput, SkillUpdateWithoutEvidenceInput>, SkillUncheckedUpdateWithoutEvidenceInput>
  }

  export type CareerAnalysisCreateNestedOneWithoutGapsInput = {
    create?: XOR<CareerAnalysisCreateWithoutGapsInput, CareerAnalysisUncheckedCreateWithoutGapsInput>
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutGapsInput
    connect?: CareerAnalysisWhereUniqueInput
  }

  export type SkillCreateNestedOneWithoutGapsInput = {
    create?: XOR<SkillCreateWithoutGapsInput, SkillUncheckedCreateWithoutGapsInput>
    connectOrCreate?: SkillCreateOrConnectWithoutGapsInput
    connect?: SkillWhereUniqueInput
  }

  export type RoadmapTaskCreateNestedManyWithoutSkillGapInput = {
    create?: XOR<RoadmapTaskCreateWithoutSkillGapInput, RoadmapTaskUncheckedCreateWithoutSkillGapInput> | RoadmapTaskCreateWithoutSkillGapInput[] | RoadmapTaskUncheckedCreateWithoutSkillGapInput[]
    connectOrCreate?: RoadmapTaskCreateOrConnectWithoutSkillGapInput | RoadmapTaskCreateOrConnectWithoutSkillGapInput[]
    createMany?: RoadmapTaskCreateManySkillGapInputEnvelope
    connect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
  }

  export type RoadmapTaskUncheckedCreateNestedManyWithoutSkillGapInput = {
    create?: XOR<RoadmapTaskCreateWithoutSkillGapInput, RoadmapTaskUncheckedCreateWithoutSkillGapInput> | RoadmapTaskCreateWithoutSkillGapInput[] | RoadmapTaskUncheckedCreateWithoutSkillGapInput[]
    connectOrCreate?: RoadmapTaskCreateOrConnectWithoutSkillGapInput | RoadmapTaskCreateOrConnectWithoutSkillGapInput[]
    createMany?: RoadmapTaskCreateManySkillGapInputEnvelope
    connect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
  }

  export type EnumGapStatusFieldUpdateOperationsInput = {
    set?: $Enums.GapStatus
  }

  export type CareerAnalysisUpdateOneRequiredWithoutGapsNestedInput = {
    create?: XOR<CareerAnalysisCreateWithoutGapsInput, CareerAnalysisUncheckedCreateWithoutGapsInput>
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutGapsInput
    upsert?: CareerAnalysisUpsertWithoutGapsInput
    connect?: CareerAnalysisWhereUniqueInput
    update?: XOR<XOR<CareerAnalysisUpdateToOneWithWhereWithoutGapsInput, CareerAnalysisUpdateWithoutGapsInput>, CareerAnalysisUncheckedUpdateWithoutGapsInput>
  }

  export type SkillUpdateOneRequiredWithoutGapsNestedInput = {
    create?: XOR<SkillCreateWithoutGapsInput, SkillUncheckedCreateWithoutGapsInput>
    connectOrCreate?: SkillCreateOrConnectWithoutGapsInput
    upsert?: SkillUpsertWithoutGapsInput
    connect?: SkillWhereUniqueInput
    update?: XOR<XOR<SkillUpdateToOneWithWhereWithoutGapsInput, SkillUpdateWithoutGapsInput>, SkillUncheckedUpdateWithoutGapsInput>
  }

  export type RoadmapTaskUpdateManyWithoutSkillGapNestedInput = {
    create?: XOR<RoadmapTaskCreateWithoutSkillGapInput, RoadmapTaskUncheckedCreateWithoutSkillGapInput> | RoadmapTaskCreateWithoutSkillGapInput[] | RoadmapTaskUncheckedCreateWithoutSkillGapInput[]
    connectOrCreate?: RoadmapTaskCreateOrConnectWithoutSkillGapInput | RoadmapTaskCreateOrConnectWithoutSkillGapInput[]
    upsert?: RoadmapTaskUpsertWithWhereUniqueWithoutSkillGapInput | RoadmapTaskUpsertWithWhereUniqueWithoutSkillGapInput[]
    createMany?: RoadmapTaskCreateManySkillGapInputEnvelope
    set?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    disconnect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    delete?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    connect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    update?: RoadmapTaskUpdateWithWhereUniqueWithoutSkillGapInput | RoadmapTaskUpdateWithWhereUniqueWithoutSkillGapInput[]
    updateMany?: RoadmapTaskUpdateManyWithWhereWithoutSkillGapInput | RoadmapTaskUpdateManyWithWhereWithoutSkillGapInput[]
    deleteMany?: RoadmapTaskScalarWhereInput | RoadmapTaskScalarWhereInput[]
  }

  export type RoadmapTaskUncheckedUpdateManyWithoutSkillGapNestedInput = {
    create?: XOR<RoadmapTaskCreateWithoutSkillGapInput, RoadmapTaskUncheckedCreateWithoutSkillGapInput> | RoadmapTaskCreateWithoutSkillGapInput[] | RoadmapTaskUncheckedCreateWithoutSkillGapInput[]
    connectOrCreate?: RoadmapTaskCreateOrConnectWithoutSkillGapInput | RoadmapTaskCreateOrConnectWithoutSkillGapInput[]
    upsert?: RoadmapTaskUpsertWithWhereUniqueWithoutSkillGapInput | RoadmapTaskUpsertWithWhereUniqueWithoutSkillGapInput[]
    createMany?: RoadmapTaskCreateManySkillGapInputEnvelope
    set?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    disconnect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    delete?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    connect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    update?: RoadmapTaskUpdateWithWhereUniqueWithoutSkillGapInput | RoadmapTaskUpdateWithWhereUniqueWithoutSkillGapInput[]
    updateMany?: RoadmapTaskUpdateManyWithWhereWithoutSkillGapInput | RoadmapTaskUpdateManyWithWhereWithoutSkillGapInput[]
    deleteMany?: RoadmapTaskScalarWhereInput | RoadmapTaskScalarWhereInput[]
  }

  export type CareerAnalysisCreateNestedOneWithoutRoadmapInput = {
    create?: XOR<CareerAnalysisCreateWithoutRoadmapInput, CareerAnalysisUncheckedCreateWithoutRoadmapInput>
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutRoadmapInput
    connect?: CareerAnalysisWhereUniqueInput
  }

  export type RoadmapTaskCreateNestedManyWithoutRoadmapInput = {
    create?: XOR<RoadmapTaskCreateWithoutRoadmapInput, RoadmapTaskUncheckedCreateWithoutRoadmapInput> | RoadmapTaskCreateWithoutRoadmapInput[] | RoadmapTaskUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapTaskCreateOrConnectWithoutRoadmapInput | RoadmapTaskCreateOrConnectWithoutRoadmapInput[]
    createMany?: RoadmapTaskCreateManyRoadmapInputEnvelope
    connect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
  }

  export type RoadmapTaskUncheckedCreateNestedManyWithoutRoadmapInput = {
    create?: XOR<RoadmapTaskCreateWithoutRoadmapInput, RoadmapTaskUncheckedCreateWithoutRoadmapInput> | RoadmapTaskCreateWithoutRoadmapInput[] | RoadmapTaskUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapTaskCreateOrConnectWithoutRoadmapInput | RoadmapTaskCreateOrConnectWithoutRoadmapInput[]
    createMany?: RoadmapTaskCreateManyRoadmapInputEnvelope
    connect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
  }

  export type CareerAnalysisUpdateOneRequiredWithoutRoadmapNestedInput = {
    create?: XOR<CareerAnalysisCreateWithoutRoadmapInput, CareerAnalysisUncheckedCreateWithoutRoadmapInput>
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutRoadmapInput
    upsert?: CareerAnalysisUpsertWithoutRoadmapInput
    connect?: CareerAnalysisWhereUniqueInput
    update?: XOR<XOR<CareerAnalysisUpdateToOneWithWhereWithoutRoadmapInput, CareerAnalysisUpdateWithoutRoadmapInput>, CareerAnalysisUncheckedUpdateWithoutRoadmapInput>
  }

  export type RoadmapTaskUpdateManyWithoutRoadmapNestedInput = {
    create?: XOR<RoadmapTaskCreateWithoutRoadmapInput, RoadmapTaskUncheckedCreateWithoutRoadmapInput> | RoadmapTaskCreateWithoutRoadmapInput[] | RoadmapTaskUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapTaskCreateOrConnectWithoutRoadmapInput | RoadmapTaskCreateOrConnectWithoutRoadmapInput[]
    upsert?: RoadmapTaskUpsertWithWhereUniqueWithoutRoadmapInput | RoadmapTaskUpsertWithWhereUniqueWithoutRoadmapInput[]
    createMany?: RoadmapTaskCreateManyRoadmapInputEnvelope
    set?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    disconnect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    delete?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    connect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    update?: RoadmapTaskUpdateWithWhereUniqueWithoutRoadmapInput | RoadmapTaskUpdateWithWhereUniqueWithoutRoadmapInput[]
    updateMany?: RoadmapTaskUpdateManyWithWhereWithoutRoadmapInput | RoadmapTaskUpdateManyWithWhereWithoutRoadmapInput[]
    deleteMany?: RoadmapTaskScalarWhereInput | RoadmapTaskScalarWhereInput[]
  }

  export type RoadmapTaskUncheckedUpdateManyWithoutRoadmapNestedInput = {
    create?: XOR<RoadmapTaskCreateWithoutRoadmapInput, RoadmapTaskUncheckedCreateWithoutRoadmapInput> | RoadmapTaskCreateWithoutRoadmapInput[] | RoadmapTaskUncheckedCreateWithoutRoadmapInput[]
    connectOrCreate?: RoadmapTaskCreateOrConnectWithoutRoadmapInput | RoadmapTaskCreateOrConnectWithoutRoadmapInput[]
    upsert?: RoadmapTaskUpsertWithWhereUniqueWithoutRoadmapInput | RoadmapTaskUpsertWithWhereUniqueWithoutRoadmapInput[]
    createMany?: RoadmapTaskCreateManyRoadmapInputEnvelope
    set?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    disconnect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    delete?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    connect?: RoadmapTaskWhereUniqueInput | RoadmapTaskWhereUniqueInput[]
    update?: RoadmapTaskUpdateWithWhereUniqueWithoutRoadmapInput | RoadmapTaskUpdateWithWhereUniqueWithoutRoadmapInput[]
    updateMany?: RoadmapTaskUpdateManyWithWhereWithoutRoadmapInput | RoadmapTaskUpdateManyWithWhereWithoutRoadmapInput[]
    deleteMany?: RoadmapTaskScalarWhereInput | RoadmapTaskScalarWhereInput[]
  }

  export type RoadmapCreateNestedOneWithoutTasksInput = {
    create?: XOR<RoadmapCreateWithoutTasksInput, RoadmapUncheckedCreateWithoutTasksInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutTasksInput
    connect?: RoadmapWhereUniqueInput
  }

  export type SkillGapCreateNestedOneWithoutTasksInput = {
    create?: XOR<SkillGapCreateWithoutTasksInput, SkillGapUncheckedCreateWithoutTasksInput>
    connectOrCreate?: SkillGapCreateOrConnectWithoutTasksInput
    connect?: SkillGapWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type RoadmapUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<RoadmapCreateWithoutTasksInput, RoadmapUncheckedCreateWithoutTasksInput>
    connectOrCreate?: RoadmapCreateOrConnectWithoutTasksInput
    upsert?: RoadmapUpsertWithoutTasksInput
    connect?: RoadmapWhereUniqueInput
    update?: XOR<XOR<RoadmapUpdateToOneWithWhereWithoutTasksInput, RoadmapUpdateWithoutTasksInput>, RoadmapUncheckedUpdateWithoutTasksInput>
  }

  export type SkillGapUpdateOneWithoutTasksNestedInput = {
    create?: XOR<SkillGapCreateWithoutTasksInput, SkillGapUncheckedCreateWithoutTasksInput>
    connectOrCreate?: SkillGapCreateOrConnectWithoutTasksInput
    upsert?: SkillGapUpsertWithoutTasksInput
    disconnect?: SkillGapWhereInput | boolean
    delete?: SkillGapWhereInput | boolean
    connect?: SkillGapWhereUniqueInput
    update?: XOR<XOR<SkillGapUpdateToOneWithWhereWithoutTasksInput, SkillGapUpdateWithoutTasksInput>, SkillGapUncheckedUpdateWithoutTasksInput>
  }

  export type CareerAnalysisCreateNestedOneWithoutEventsInput = {
    create?: XOR<CareerAnalysisCreateWithoutEventsInput, CareerAnalysisUncheckedCreateWithoutEventsInput>
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutEventsInput
    connect?: CareerAnalysisWhereUniqueInput
  }

  export type EnumAnalysisEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.AnalysisEventType
  }

  export type CareerAnalysisUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<CareerAnalysisCreateWithoutEventsInput, CareerAnalysisUncheckedCreateWithoutEventsInput>
    connectOrCreate?: CareerAnalysisCreateOrConnectWithoutEventsInput
    upsert?: CareerAnalysisUpsertWithoutEventsInput
    connect?: CareerAnalysisWhereUniqueInput
    update?: XOR<XOR<CareerAnalysisUpdateToOneWithWhereWithoutEventsInput, CareerAnalysisUpdateWithoutEventsInput>, CareerAnalysisUncheckedUpdateWithoutEventsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumSkillImportanceFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillImportance | EnumSkillImportanceFieldRefInput<$PrismaModel>
    in?: $Enums.SkillImportance[] | ListEnumSkillImportanceFieldRefInput<$PrismaModel>
    notIn?: $Enums.SkillImportance[] | ListEnumSkillImportanceFieldRefInput<$PrismaModel>
    not?: NestedEnumSkillImportanceFilter<$PrismaModel> | $Enums.SkillImportance
  }

  export type NestedEnumSkillImportanceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillImportance | EnumSkillImportanceFieldRefInput<$PrismaModel>
    in?: $Enums.SkillImportance[] | ListEnumSkillImportanceFieldRefInput<$PrismaModel>
    notIn?: $Enums.SkillImportance[] | ListEnumSkillImportanceFieldRefInput<$PrismaModel>
    not?: NestedEnumSkillImportanceWithAggregatesFilter<$PrismaModel> | $Enums.SkillImportance
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSkillImportanceFilter<$PrismaModel>
    _max?: NestedEnumSkillImportanceFilter<$PrismaModel>
  }

  export type NestedEnumCareerAnalysisStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CareerAnalysisStatus | EnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CareerAnalysisStatus[] | ListEnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CareerAnalysisStatus[] | ListEnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCareerAnalysisStatusFilter<$PrismaModel> | $Enums.CareerAnalysisStatus
  }

  export type NestedEnumCareerAnalysisStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CareerAnalysisStatus | EnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CareerAnalysisStatus[] | ListEnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CareerAnalysisStatus[] | ListEnumCareerAnalysisStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCareerAnalysisStatusWithAggregatesFilter<$PrismaModel> | $Enums.CareerAnalysisStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCareerAnalysisStatusFilter<$PrismaModel>
    _max?: NestedEnumCareerAnalysisStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumEvidenceStrengthFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceStrength | EnumEvidenceStrengthFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceStrength[] | ListEnumEvidenceStrengthFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceStrength[] | ListEnumEvidenceStrengthFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceStrengthFilter<$PrismaModel> | $Enums.EvidenceStrength
  }

  export type NestedEnumEvidenceStrengthWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceStrength | EnumEvidenceStrengthFieldRefInput<$PrismaModel>
    in?: $Enums.EvidenceStrength[] | ListEnumEvidenceStrengthFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvidenceStrength[] | ListEnumEvidenceStrengthFieldRefInput<$PrismaModel>
    not?: NestedEnumEvidenceStrengthWithAggregatesFilter<$PrismaModel> | $Enums.EvidenceStrength
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEvidenceStrengthFilter<$PrismaModel>
    _max?: NestedEnumEvidenceStrengthFilter<$PrismaModel>
  }

  export type NestedEnumGapStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GapStatus | EnumGapStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GapStatus[] | ListEnumGapStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GapStatus[] | ListEnumGapStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGapStatusFilter<$PrismaModel> | $Enums.GapStatus
  }

  export type NestedEnumGapStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GapStatus | EnumGapStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GapStatus[] | ListEnumGapStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GapStatus[] | ListEnumGapStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGapStatusWithAggregatesFilter<$PrismaModel> | $Enums.GapStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGapStatusFilter<$PrismaModel>
    _max?: NestedEnumGapStatusFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumAnalysisEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AnalysisEventType | EnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnalysisEventType[] | ListEnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnalysisEventType[] | ListEnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnalysisEventTypeFilter<$PrismaModel> | $Enums.AnalysisEventType
  }

  export type NestedEnumAnalysisEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AnalysisEventType | EnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnalysisEventType[] | ListEnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnalysisEventType[] | ListEnumAnalysisEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnalysisEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.AnalysisEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAnalysisEventTypeFilter<$PrismaModel>
    _max?: NestedEnumAnalysisEventTypeFilter<$PrismaModel>
  }

  export type ResumeCreateWithoutUserInput = {
    id?: string
    title: string
    originalFileName: string
    mimeType: string
    fileSize: number
    fileUrl: string
    filePath?: string | null
    rawText: string
    structuredResume: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    analyses?: CareerAnalysisCreateNestedManyWithoutResumeInput
  }

  export type ResumeUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    originalFileName: string
    mimeType: string
    fileSize: number
    fileUrl: string
    filePath?: string | null
    rawText: string
    structuredResume: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    analyses?: CareerAnalysisUncheckedCreateNestedManyWithoutResumeInput
  }

  export type ResumeCreateOrConnectWithoutUserInput = {
    where: ResumeWhereUniqueInput
    create: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput>
  }

  export type ResumeCreateManyUserInputEnvelope = {
    data: ResumeCreateManyUserInput | ResumeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RefreshTokenCreateWithoutUserInput = {
    id?: string
    familyId: string
    tokenHash: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type RefreshTokenUncheckedCreateWithoutUserInput = {
    id?: string
    familyId: string
    tokenHash: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type RefreshTokenCreateOrConnectWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateManyUserInputEnvelope = {
    data: RefreshTokenCreateManyUserInput | RefreshTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CareerAnalysisCreateWithoutUserInput = {
    id?: string
    status?: $Enums.CareerAnalysisStatus
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    resume: ResumeCreateNestedOneWithoutAnalysesInput
    role: RoleCreateNestedOneWithoutAnalysesInput
    evidence?: CandidateSkillEvidenceCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisUncheckedCreateWithoutUserInput = {
    id?: string
    status?: $Enums.CareerAnalysisStatus
    resumeId: string
    roleId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapUncheckedCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapUncheckedCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventUncheckedCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisCreateOrConnectWithoutUserInput = {
    where: CareerAnalysisWhereUniqueInput
    create: XOR<CareerAnalysisCreateWithoutUserInput, CareerAnalysisUncheckedCreateWithoutUserInput>
  }

  export type CareerAnalysisCreateManyUserInputEnvelope = {
    data: CareerAnalysisCreateManyUserInput | CareerAnalysisCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ResumeUpsertWithWhereUniqueWithoutUserInput = {
    where: ResumeWhereUniqueInput
    update: XOR<ResumeUpdateWithoutUserInput, ResumeUncheckedUpdateWithoutUserInput>
    create: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput>
  }

  export type ResumeUpdateWithWhereUniqueWithoutUserInput = {
    where: ResumeWhereUniqueInput
    data: XOR<ResumeUpdateWithoutUserInput, ResumeUncheckedUpdateWithoutUserInput>
  }

  export type ResumeUpdateManyWithWhereWithoutUserInput = {
    where: ResumeScalarWhereInput
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyWithoutUserInput>
  }

  export type ResumeScalarWhereInput = {
    AND?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
    OR?: ResumeScalarWhereInput[]
    NOT?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
    id?: UuidFilter<"Resume"> | string
    userId?: UuidFilter<"Resume"> | string
    title?: StringFilter<"Resume"> | string
    originalFileName?: StringFilter<"Resume"> | string
    mimeType?: StringFilter<"Resume"> | string
    fileSize?: IntFilter<"Resume"> | number
    fileUrl?: StringFilter<"Resume"> | string
    filePath?: StringNullableFilter<"Resume"> | string | null
    rawText?: StringFilter<"Resume"> | string
    structuredResume?: JsonFilter<"Resume">
    createdAt?: DateTimeFilter<"Resume"> | Date | string
    updatedAt?: DateTimeFilter<"Resume"> | Date | string
  }

  export type RefreshTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    update: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    data: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUpdateManyWithWhereWithoutUserInput = {
    where: RefreshTokenScalarWhereInput
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type RefreshTokenScalarWhereInput = {
    AND?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    OR?: RefreshTokenScalarWhereInput[]
    NOT?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    id?: UuidFilter<"RefreshToken"> | string
    familyId?: UuidFilter<"RefreshToken"> | string
    tokenHash?: StringFilter<"RefreshToken"> | string
    userId?: UuidFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    revokedAt?: DateTimeNullableFilter<"RefreshToken"> | Date | string | null
  }

  export type CareerAnalysisUpsertWithWhereUniqueWithoutUserInput = {
    where: CareerAnalysisWhereUniqueInput
    update: XOR<CareerAnalysisUpdateWithoutUserInput, CareerAnalysisUncheckedUpdateWithoutUserInput>
    create: XOR<CareerAnalysisCreateWithoutUserInput, CareerAnalysisUncheckedCreateWithoutUserInput>
  }

  export type CareerAnalysisUpdateWithWhereUniqueWithoutUserInput = {
    where: CareerAnalysisWhereUniqueInput
    data: XOR<CareerAnalysisUpdateWithoutUserInput, CareerAnalysisUncheckedUpdateWithoutUserInput>
  }

  export type CareerAnalysisUpdateManyWithWhereWithoutUserInput = {
    where: CareerAnalysisScalarWhereInput
    data: XOR<CareerAnalysisUpdateManyMutationInput, CareerAnalysisUncheckedUpdateManyWithoutUserInput>
  }

  export type CareerAnalysisScalarWhereInput = {
    AND?: CareerAnalysisScalarWhereInput | CareerAnalysisScalarWhereInput[]
    OR?: CareerAnalysisScalarWhereInput[]
    NOT?: CareerAnalysisScalarWhereInput | CareerAnalysisScalarWhereInput[]
    id?: UuidFilter<"CareerAnalysis"> | string
    userId?: UuidFilter<"CareerAnalysis"> | string
    status?: EnumCareerAnalysisStatusFilter<"CareerAnalysis"> | $Enums.CareerAnalysisStatus
    resumeId?: UuidFilter<"CareerAnalysis"> | string
    roleId?: UuidFilter<"CareerAnalysis"> | string
    resumeSnapshot?: JsonFilter<"CareerAnalysis">
    roleSnapshot?: JsonFilter<"CareerAnalysis">
    readinessScore?: IntNullableFilter<"CareerAnalysis"> | number | null
    readinessBreakdown?: JsonNullableFilter<"CareerAnalysis">
    failureReason?: StringNullableFilter<"CareerAnalysis"> | string | null
    createdAt?: DateTimeFilter<"CareerAnalysis"> | Date | string
    completedAt?: DateTimeNullableFilter<"CareerAnalysis"> | Date | string | null
  }

  export type UserCreateWithoutRefreshTokensInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resumes?: ResumeCreateNestedManyWithoutUserInput
    analyses?: CareerAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRefreshTokensInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
    analyses?: CareerAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRefreshTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
  }

  export type UserUpsertWithoutRefreshTokensInput = {
    update: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUpdateManyWithoutUserNestedInput
    analyses?: CareerAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
    analyses?: CareerAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutResumesInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    analyses?: CareerAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutResumesInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    analyses?: CareerAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutResumesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
  }

  export type CareerAnalysisCreateWithoutResumeInput = {
    id?: string
    status?: $Enums.CareerAnalysisStatus
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutAnalysesInput
    role: RoleCreateNestedOneWithoutAnalysesInput
    evidence?: CandidateSkillEvidenceCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisUncheckedCreateWithoutResumeInput = {
    id?: string
    userId: string
    status?: $Enums.CareerAnalysisStatus
    roleId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapUncheckedCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapUncheckedCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventUncheckedCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisCreateOrConnectWithoutResumeInput = {
    where: CareerAnalysisWhereUniqueInput
    create: XOR<CareerAnalysisCreateWithoutResumeInput, CareerAnalysisUncheckedCreateWithoutResumeInput>
  }

  export type CareerAnalysisCreateManyResumeInputEnvelope = {
    data: CareerAnalysisCreateManyResumeInput | CareerAnalysisCreateManyResumeInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutResumesInput = {
    update: XOR<UserUpdateWithoutResumesInput, UserUncheckedUpdateWithoutResumesInput>
    create: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutResumesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutResumesInput, UserUncheckedUpdateWithoutResumesInput>
  }

  export type UserUpdateWithoutResumesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    analyses?: CareerAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutResumesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    analyses?: CareerAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CareerAnalysisUpsertWithWhereUniqueWithoutResumeInput = {
    where: CareerAnalysisWhereUniqueInput
    update: XOR<CareerAnalysisUpdateWithoutResumeInput, CareerAnalysisUncheckedUpdateWithoutResumeInput>
    create: XOR<CareerAnalysisCreateWithoutResumeInput, CareerAnalysisUncheckedCreateWithoutResumeInput>
  }

  export type CareerAnalysisUpdateWithWhereUniqueWithoutResumeInput = {
    where: CareerAnalysisWhereUniqueInput
    data: XOR<CareerAnalysisUpdateWithoutResumeInput, CareerAnalysisUncheckedUpdateWithoutResumeInput>
  }

  export type CareerAnalysisUpdateManyWithWhereWithoutResumeInput = {
    where: CareerAnalysisScalarWhereInput
    data: XOR<CareerAnalysisUpdateManyMutationInput, CareerAnalysisUncheckedUpdateManyWithoutResumeInput>
  }

  export type RoleSkillRequirementCreateWithoutSkillInput = {
    id?: string
    importance: $Enums.SkillImportance
    rationale: string
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutRequirementsInput
  }

  export type RoleSkillRequirementUncheckedCreateWithoutSkillInput = {
    id?: string
    roleId: string
    importance: $Enums.SkillImportance
    rationale: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleSkillRequirementCreateOrConnectWithoutSkillInput = {
    where: RoleSkillRequirementWhereUniqueInput
    create: XOR<RoleSkillRequirementCreateWithoutSkillInput, RoleSkillRequirementUncheckedCreateWithoutSkillInput>
  }

  export type RoleSkillRequirementCreateManySkillInputEnvelope = {
    data: RoleSkillRequirementCreateManySkillInput | RoleSkillRequirementCreateManySkillInput[]
    skipDuplicates?: boolean
  }

  export type CandidateSkillEvidenceCreateWithoutSkillInput = {
    id?: string
    strength: $Enums.EvidenceStrength
    quote: string
    sourceSection: string
    sourceLabel: string
    createdAt?: Date | string
    careerAnalysis: CareerAnalysisCreateNestedOneWithoutEvidenceInput
  }

  export type CandidateSkillEvidenceUncheckedCreateWithoutSkillInput = {
    id?: string
    careerAnalysisId: string
    strength: $Enums.EvidenceStrength
    quote: string
    sourceSection: string
    sourceLabel: string
    createdAt?: Date | string
  }

  export type CandidateSkillEvidenceCreateOrConnectWithoutSkillInput = {
    where: CandidateSkillEvidenceWhereUniqueInput
    create: XOR<CandidateSkillEvidenceCreateWithoutSkillInput, CandidateSkillEvidenceUncheckedCreateWithoutSkillInput>
  }

  export type CandidateSkillEvidenceCreateManySkillInputEnvelope = {
    data: CandidateSkillEvidenceCreateManySkillInput | CandidateSkillEvidenceCreateManySkillInput[]
    skipDuplicates?: boolean
  }

  export type SkillGapCreateWithoutSkillInput = {
    id?: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
    careerAnalysis: CareerAnalysisCreateNestedOneWithoutGapsInput
    tasks?: RoadmapTaskCreateNestedManyWithoutSkillGapInput
  }

  export type SkillGapUncheckedCreateWithoutSkillInput = {
    id?: string
    careerAnalysisId: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
    tasks?: RoadmapTaskUncheckedCreateNestedManyWithoutSkillGapInput
  }

  export type SkillGapCreateOrConnectWithoutSkillInput = {
    where: SkillGapWhereUniqueInput
    create: XOR<SkillGapCreateWithoutSkillInput, SkillGapUncheckedCreateWithoutSkillInput>
  }

  export type SkillGapCreateManySkillInputEnvelope = {
    data: SkillGapCreateManySkillInput | SkillGapCreateManySkillInput[]
    skipDuplicates?: boolean
  }

  export type RoleSkillRequirementUpsertWithWhereUniqueWithoutSkillInput = {
    where: RoleSkillRequirementWhereUniqueInput
    update: XOR<RoleSkillRequirementUpdateWithoutSkillInput, RoleSkillRequirementUncheckedUpdateWithoutSkillInput>
    create: XOR<RoleSkillRequirementCreateWithoutSkillInput, RoleSkillRequirementUncheckedCreateWithoutSkillInput>
  }

  export type RoleSkillRequirementUpdateWithWhereUniqueWithoutSkillInput = {
    where: RoleSkillRequirementWhereUniqueInput
    data: XOR<RoleSkillRequirementUpdateWithoutSkillInput, RoleSkillRequirementUncheckedUpdateWithoutSkillInput>
  }

  export type RoleSkillRequirementUpdateManyWithWhereWithoutSkillInput = {
    where: RoleSkillRequirementScalarWhereInput
    data: XOR<RoleSkillRequirementUpdateManyMutationInput, RoleSkillRequirementUncheckedUpdateManyWithoutSkillInput>
  }

  export type RoleSkillRequirementScalarWhereInput = {
    AND?: RoleSkillRequirementScalarWhereInput | RoleSkillRequirementScalarWhereInput[]
    OR?: RoleSkillRequirementScalarWhereInput[]
    NOT?: RoleSkillRequirementScalarWhereInput | RoleSkillRequirementScalarWhereInput[]
    id?: UuidFilter<"RoleSkillRequirement"> | string
    roleId?: UuidFilter<"RoleSkillRequirement"> | string
    skillId?: UuidFilter<"RoleSkillRequirement"> | string
    importance?: EnumSkillImportanceFilter<"RoleSkillRequirement"> | $Enums.SkillImportance
    rationale?: StringFilter<"RoleSkillRequirement"> | string
    createdAt?: DateTimeFilter<"RoleSkillRequirement"> | Date | string
    updatedAt?: DateTimeFilter<"RoleSkillRequirement"> | Date | string
  }

  export type CandidateSkillEvidenceUpsertWithWhereUniqueWithoutSkillInput = {
    where: CandidateSkillEvidenceWhereUniqueInput
    update: XOR<CandidateSkillEvidenceUpdateWithoutSkillInput, CandidateSkillEvidenceUncheckedUpdateWithoutSkillInput>
    create: XOR<CandidateSkillEvidenceCreateWithoutSkillInput, CandidateSkillEvidenceUncheckedCreateWithoutSkillInput>
  }

  export type CandidateSkillEvidenceUpdateWithWhereUniqueWithoutSkillInput = {
    where: CandidateSkillEvidenceWhereUniqueInput
    data: XOR<CandidateSkillEvidenceUpdateWithoutSkillInput, CandidateSkillEvidenceUncheckedUpdateWithoutSkillInput>
  }

  export type CandidateSkillEvidenceUpdateManyWithWhereWithoutSkillInput = {
    where: CandidateSkillEvidenceScalarWhereInput
    data: XOR<CandidateSkillEvidenceUpdateManyMutationInput, CandidateSkillEvidenceUncheckedUpdateManyWithoutSkillInput>
  }

  export type CandidateSkillEvidenceScalarWhereInput = {
    AND?: CandidateSkillEvidenceScalarWhereInput | CandidateSkillEvidenceScalarWhereInput[]
    OR?: CandidateSkillEvidenceScalarWhereInput[]
    NOT?: CandidateSkillEvidenceScalarWhereInput | CandidateSkillEvidenceScalarWhereInput[]
    id?: UuidFilter<"CandidateSkillEvidence"> | string
    careerAnalysisId?: UuidFilter<"CandidateSkillEvidence"> | string
    skillId?: UuidFilter<"CandidateSkillEvidence"> | string
    strength?: EnumEvidenceStrengthFilter<"CandidateSkillEvidence"> | $Enums.EvidenceStrength
    quote?: StringFilter<"CandidateSkillEvidence"> | string
    sourceSection?: StringFilter<"CandidateSkillEvidence"> | string
    sourceLabel?: StringFilter<"CandidateSkillEvidence"> | string
    createdAt?: DateTimeFilter<"CandidateSkillEvidence"> | Date | string
  }

  export type SkillGapUpsertWithWhereUniqueWithoutSkillInput = {
    where: SkillGapWhereUniqueInput
    update: XOR<SkillGapUpdateWithoutSkillInput, SkillGapUncheckedUpdateWithoutSkillInput>
    create: XOR<SkillGapCreateWithoutSkillInput, SkillGapUncheckedCreateWithoutSkillInput>
  }

  export type SkillGapUpdateWithWhereUniqueWithoutSkillInput = {
    where: SkillGapWhereUniqueInput
    data: XOR<SkillGapUpdateWithoutSkillInput, SkillGapUncheckedUpdateWithoutSkillInput>
  }

  export type SkillGapUpdateManyWithWhereWithoutSkillInput = {
    where: SkillGapScalarWhereInput
    data: XOR<SkillGapUpdateManyMutationInput, SkillGapUncheckedUpdateManyWithoutSkillInput>
  }

  export type SkillGapScalarWhereInput = {
    AND?: SkillGapScalarWhereInput | SkillGapScalarWhereInput[]
    OR?: SkillGapScalarWhereInput[]
    NOT?: SkillGapScalarWhereInput | SkillGapScalarWhereInput[]
    id?: UuidFilter<"SkillGap"> | string
    careerAnalysisId?: UuidFilter<"SkillGap"> | string
    skillId?: UuidFilter<"SkillGap"> | string
    status?: EnumGapStatusFilter<"SkillGap"> | $Enums.GapStatus
    priority?: IntFilter<"SkillGap"> | number
    reasoning?: StringFilter<"SkillGap"> | string
    createdAt?: DateTimeFilter<"SkillGap"> | Date | string
  }

  export type RoleSkillRequirementCreateWithoutRoleInput = {
    id?: string
    importance: $Enums.SkillImportance
    rationale: string
    createdAt?: Date | string
    updatedAt?: Date | string
    skill: SkillCreateNestedOneWithoutRequirementsInput
  }

  export type RoleSkillRequirementUncheckedCreateWithoutRoleInput = {
    id?: string
    skillId: string
    importance: $Enums.SkillImportance
    rationale: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleSkillRequirementCreateOrConnectWithoutRoleInput = {
    where: RoleSkillRequirementWhereUniqueInput
    create: XOR<RoleSkillRequirementCreateWithoutRoleInput, RoleSkillRequirementUncheckedCreateWithoutRoleInput>
  }

  export type RoleSkillRequirementCreateManyRoleInputEnvelope = {
    data: RoleSkillRequirementCreateManyRoleInput | RoleSkillRequirementCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type CareerAnalysisCreateWithoutRoleInput = {
    id?: string
    status?: $Enums.CareerAnalysisStatus
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutAnalysesInput
    resume: ResumeCreateNestedOneWithoutAnalysesInput
    evidence?: CandidateSkillEvidenceCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisUncheckedCreateWithoutRoleInput = {
    id?: string
    userId: string
    status?: $Enums.CareerAnalysisStatus
    resumeId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapUncheckedCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapUncheckedCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventUncheckedCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisCreateOrConnectWithoutRoleInput = {
    where: CareerAnalysisWhereUniqueInput
    create: XOR<CareerAnalysisCreateWithoutRoleInput, CareerAnalysisUncheckedCreateWithoutRoleInput>
  }

  export type CareerAnalysisCreateManyRoleInputEnvelope = {
    data: CareerAnalysisCreateManyRoleInput | CareerAnalysisCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type RoleSkillRequirementUpsertWithWhereUniqueWithoutRoleInput = {
    where: RoleSkillRequirementWhereUniqueInput
    update: XOR<RoleSkillRequirementUpdateWithoutRoleInput, RoleSkillRequirementUncheckedUpdateWithoutRoleInput>
    create: XOR<RoleSkillRequirementCreateWithoutRoleInput, RoleSkillRequirementUncheckedCreateWithoutRoleInput>
  }

  export type RoleSkillRequirementUpdateWithWhereUniqueWithoutRoleInput = {
    where: RoleSkillRequirementWhereUniqueInput
    data: XOR<RoleSkillRequirementUpdateWithoutRoleInput, RoleSkillRequirementUncheckedUpdateWithoutRoleInput>
  }

  export type RoleSkillRequirementUpdateManyWithWhereWithoutRoleInput = {
    where: RoleSkillRequirementScalarWhereInput
    data: XOR<RoleSkillRequirementUpdateManyMutationInput, RoleSkillRequirementUncheckedUpdateManyWithoutRoleInput>
  }

  export type CareerAnalysisUpsertWithWhereUniqueWithoutRoleInput = {
    where: CareerAnalysisWhereUniqueInput
    update: XOR<CareerAnalysisUpdateWithoutRoleInput, CareerAnalysisUncheckedUpdateWithoutRoleInput>
    create: XOR<CareerAnalysisCreateWithoutRoleInput, CareerAnalysisUncheckedCreateWithoutRoleInput>
  }

  export type CareerAnalysisUpdateWithWhereUniqueWithoutRoleInput = {
    where: CareerAnalysisWhereUniqueInput
    data: XOR<CareerAnalysisUpdateWithoutRoleInput, CareerAnalysisUncheckedUpdateWithoutRoleInput>
  }

  export type CareerAnalysisUpdateManyWithWhereWithoutRoleInput = {
    where: CareerAnalysisScalarWhereInput
    data: XOR<CareerAnalysisUpdateManyMutationInput, CareerAnalysisUncheckedUpdateManyWithoutRoleInput>
  }

  export type RoleCreateWithoutRequirementsInput = {
    id?: string
    slug: string
    title: string
    description: string
    seedVersion: string
    createdAt?: Date | string
    updatedAt?: Date | string
    analyses?: CareerAnalysisCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutRequirementsInput = {
    id?: string
    slug: string
    title: string
    description: string
    seedVersion: string
    createdAt?: Date | string
    updatedAt?: Date | string
    analyses?: CareerAnalysisUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutRequirementsInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutRequirementsInput, RoleUncheckedCreateWithoutRequirementsInput>
  }

  export type SkillCreateWithoutRequirementsInput = {
    id?: string
    slug: string
    name: string
    aliases?: SkillCreatealiasesInput | string[]
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evidence?: CandidateSkillEvidenceCreateNestedManyWithoutSkillInput
    gaps?: SkillGapCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateWithoutRequirementsInput = {
    id?: string
    slug: string
    name: string
    aliases?: SkillCreatealiasesInput | string[]
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    evidence?: CandidateSkillEvidenceUncheckedCreateNestedManyWithoutSkillInput
    gaps?: SkillGapUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillCreateOrConnectWithoutRequirementsInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutRequirementsInput, SkillUncheckedCreateWithoutRequirementsInput>
  }

  export type RoleUpsertWithoutRequirementsInput = {
    update: XOR<RoleUpdateWithoutRequirementsInput, RoleUncheckedUpdateWithoutRequirementsInput>
    create: XOR<RoleCreateWithoutRequirementsInput, RoleUncheckedCreateWithoutRequirementsInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutRequirementsInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutRequirementsInput, RoleUncheckedUpdateWithoutRequirementsInput>
  }

  export type RoleUpdateWithoutRequirementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    seedVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analyses?: CareerAnalysisUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutRequirementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    seedVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analyses?: CareerAnalysisUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type SkillUpsertWithoutRequirementsInput = {
    update: XOR<SkillUpdateWithoutRequirementsInput, SkillUncheckedUpdateWithoutRequirementsInput>
    create: XOR<SkillCreateWithoutRequirementsInput, SkillUncheckedCreateWithoutRequirementsInput>
    where?: SkillWhereInput
  }

  export type SkillUpdateToOneWithWhereWithoutRequirementsInput = {
    where?: SkillWhereInput
    data: XOR<SkillUpdateWithoutRequirementsInput, SkillUncheckedUpdateWithoutRequirementsInput>
  }

  export type SkillUpdateWithoutRequirementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    aliases?: SkillUpdatealiasesInput | string[]
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: CandidateSkillEvidenceUpdateManyWithoutSkillNestedInput
    gaps?: SkillGapUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateWithoutRequirementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    aliases?: SkillUpdatealiasesInput | string[]
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidence?: CandidateSkillEvidenceUncheckedUpdateManyWithoutSkillNestedInput
    gaps?: SkillGapUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type UserCreateWithoutAnalysesInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resumes?: ResumeCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAnalysesInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAnalysesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAnalysesInput, UserUncheckedCreateWithoutAnalysesInput>
  }

  export type ResumeCreateWithoutAnalysesInput = {
    id?: string
    title: string
    originalFileName: string
    mimeType: string
    fileSize: number
    fileUrl: string
    filePath?: string | null
    rawText: string
    structuredResume: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutResumesInput
  }

  export type ResumeUncheckedCreateWithoutAnalysesInput = {
    id?: string
    userId: string
    title: string
    originalFileName: string
    mimeType: string
    fileSize: number
    fileUrl: string
    filePath?: string | null
    rawText: string
    structuredResume: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ResumeCreateOrConnectWithoutAnalysesInput = {
    where: ResumeWhereUniqueInput
    create: XOR<ResumeCreateWithoutAnalysesInput, ResumeUncheckedCreateWithoutAnalysesInput>
  }

  export type RoleCreateWithoutAnalysesInput = {
    id?: string
    slug: string
    title: string
    description: string
    seedVersion: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RoleSkillRequirementCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutAnalysesInput = {
    id?: string
    slug: string
    title: string
    description: string
    seedVersion: string
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RoleSkillRequirementUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutAnalysesInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutAnalysesInput, RoleUncheckedCreateWithoutAnalysesInput>
  }

  export type CandidateSkillEvidenceCreateWithoutCareerAnalysisInput = {
    id?: string
    strength: $Enums.EvidenceStrength
    quote: string
    sourceSection: string
    sourceLabel: string
    createdAt?: Date | string
    skill: SkillCreateNestedOneWithoutEvidenceInput
  }

  export type CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput = {
    id?: string
    skillId: string
    strength: $Enums.EvidenceStrength
    quote: string
    sourceSection: string
    sourceLabel: string
    createdAt?: Date | string
  }

  export type CandidateSkillEvidenceCreateOrConnectWithoutCareerAnalysisInput = {
    where: CandidateSkillEvidenceWhereUniqueInput
    create: XOR<CandidateSkillEvidenceCreateWithoutCareerAnalysisInput, CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput>
  }

  export type CandidateSkillEvidenceCreateManyCareerAnalysisInputEnvelope = {
    data: CandidateSkillEvidenceCreateManyCareerAnalysisInput | CandidateSkillEvidenceCreateManyCareerAnalysisInput[]
    skipDuplicates?: boolean
  }

  export type SkillGapCreateWithoutCareerAnalysisInput = {
    id?: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
    skill: SkillCreateNestedOneWithoutGapsInput
    tasks?: RoadmapTaskCreateNestedManyWithoutSkillGapInput
  }

  export type SkillGapUncheckedCreateWithoutCareerAnalysisInput = {
    id?: string
    skillId: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
    tasks?: RoadmapTaskUncheckedCreateNestedManyWithoutSkillGapInput
  }

  export type SkillGapCreateOrConnectWithoutCareerAnalysisInput = {
    where: SkillGapWhereUniqueInput
    create: XOR<SkillGapCreateWithoutCareerAnalysisInput, SkillGapUncheckedCreateWithoutCareerAnalysisInput>
  }

  export type SkillGapCreateManyCareerAnalysisInputEnvelope = {
    data: SkillGapCreateManyCareerAnalysisInput | SkillGapCreateManyCareerAnalysisInput[]
    skipDuplicates?: boolean
  }

  export type RoadmapCreateWithoutCareerAnalysisInput = {
    id?: string
    weekCount?: number
    createdAt?: Date | string
    tasks?: RoadmapTaskCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapUncheckedCreateWithoutCareerAnalysisInput = {
    id?: string
    weekCount?: number
    createdAt?: Date | string
    tasks?: RoadmapTaskUncheckedCreateNestedManyWithoutRoadmapInput
  }

  export type RoadmapCreateOrConnectWithoutCareerAnalysisInput = {
    where: RoadmapWhereUniqueInput
    create: XOR<RoadmapCreateWithoutCareerAnalysisInput, RoadmapUncheckedCreateWithoutCareerAnalysisInput>
  }

  export type AnalysisEventCreateWithoutCareerAnalysisInput = {
    id?: string
    type: $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AnalysisEventUncheckedCreateWithoutCareerAnalysisInput = {
    id?: string
    type: $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AnalysisEventCreateOrConnectWithoutCareerAnalysisInput = {
    where: AnalysisEventWhereUniqueInput
    create: XOR<AnalysisEventCreateWithoutCareerAnalysisInput, AnalysisEventUncheckedCreateWithoutCareerAnalysisInput>
  }

  export type AnalysisEventCreateManyCareerAnalysisInputEnvelope = {
    data: AnalysisEventCreateManyCareerAnalysisInput | AnalysisEventCreateManyCareerAnalysisInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutAnalysesInput = {
    update: XOR<UserUpdateWithoutAnalysesInput, UserUncheckedUpdateWithoutAnalysesInput>
    create: XOR<UserCreateWithoutAnalysesInput, UserUncheckedCreateWithoutAnalysesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAnalysesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAnalysesInput, UserUncheckedUpdateWithoutAnalysesInput>
  }

  export type UserUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ResumeUpsertWithoutAnalysesInput = {
    update: XOR<ResumeUpdateWithoutAnalysesInput, ResumeUncheckedUpdateWithoutAnalysesInput>
    create: XOR<ResumeCreateWithoutAnalysesInput, ResumeUncheckedCreateWithoutAnalysesInput>
    where?: ResumeWhereInput
  }

  export type ResumeUpdateToOneWithWhereWithoutAnalysesInput = {
    where?: ResumeWhereInput
    data: XOR<ResumeUpdateWithoutAnalysesInput, ResumeUncheckedUpdateWithoutAnalysesInput>
  }

  export type ResumeUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileUrl?: StringFieldUpdateOperationsInput | string
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    rawText?: StringFieldUpdateOperationsInput | string
    structuredResume?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutResumesNestedInput
  }

  export type ResumeUncheckedUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileUrl?: StringFieldUpdateOperationsInput | string
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    rawText?: StringFieldUpdateOperationsInput | string
    structuredResume?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleUpsertWithoutAnalysesInput = {
    update: XOR<RoleUpdateWithoutAnalysesInput, RoleUncheckedUpdateWithoutAnalysesInput>
    create: XOR<RoleCreateWithoutAnalysesInput, RoleUncheckedCreateWithoutAnalysesInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutAnalysesInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutAnalysesInput, RoleUncheckedUpdateWithoutAnalysesInput>
  }

  export type RoleUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    seedVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RoleSkillRequirementUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    seedVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RoleSkillRequirementUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type CandidateSkillEvidenceUpsertWithWhereUniqueWithoutCareerAnalysisInput = {
    where: CandidateSkillEvidenceWhereUniqueInput
    update: XOR<CandidateSkillEvidenceUpdateWithoutCareerAnalysisInput, CandidateSkillEvidenceUncheckedUpdateWithoutCareerAnalysisInput>
    create: XOR<CandidateSkillEvidenceCreateWithoutCareerAnalysisInput, CandidateSkillEvidenceUncheckedCreateWithoutCareerAnalysisInput>
  }

  export type CandidateSkillEvidenceUpdateWithWhereUniqueWithoutCareerAnalysisInput = {
    where: CandidateSkillEvidenceWhereUniqueInput
    data: XOR<CandidateSkillEvidenceUpdateWithoutCareerAnalysisInput, CandidateSkillEvidenceUncheckedUpdateWithoutCareerAnalysisInput>
  }

  export type CandidateSkillEvidenceUpdateManyWithWhereWithoutCareerAnalysisInput = {
    where: CandidateSkillEvidenceScalarWhereInput
    data: XOR<CandidateSkillEvidenceUpdateManyMutationInput, CandidateSkillEvidenceUncheckedUpdateManyWithoutCareerAnalysisInput>
  }

  export type SkillGapUpsertWithWhereUniqueWithoutCareerAnalysisInput = {
    where: SkillGapWhereUniqueInput
    update: XOR<SkillGapUpdateWithoutCareerAnalysisInput, SkillGapUncheckedUpdateWithoutCareerAnalysisInput>
    create: XOR<SkillGapCreateWithoutCareerAnalysisInput, SkillGapUncheckedCreateWithoutCareerAnalysisInput>
  }

  export type SkillGapUpdateWithWhereUniqueWithoutCareerAnalysisInput = {
    where: SkillGapWhereUniqueInput
    data: XOR<SkillGapUpdateWithoutCareerAnalysisInput, SkillGapUncheckedUpdateWithoutCareerAnalysisInput>
  }

  export type SkillGapUpdateManyWithWhereWithoutCareerAnalysisInput = {
    where: SkillGapScalarWhereInput
    data: XOR<SkillGapUpdateManyMutationInput, SkillGapUncheckedUpdateManyWithoutCareerAnalysisInput>
  }

  export type RoadmapUpsertWithoutCareerAnalysisInput = {
    update: XOR<RoadmapUpdateWithoutCareerAnalysisInput, RoadmapUncheckedUpdateWithoutCareerAnalysisInput>
    create: XOR<RoadmapCreateWithoutCareerAnalysisInput, RoadmapUncheckedCreateWithoutCareerAnalysisInput>
    where?: RoadmapWhereInput
  }

  export type RoadmapUpdateToOneWithWhereWithoutCareerAnalysisInput = {
    where?: RoadmapWhereInput
    data: XOR<RoadmapUpdateWithoutCareerAnalysisInput, RoadmapUncheckedUpdateWithoutCareerAnalysisInput>
  }

  export type RoadmapUpdateWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: RoadmapTaskUpdateManyWithoutRoadmapNestedInput
  }

  export type RoadmapUncheckedUpdateWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: RoadmapTaskUncheckedUpdateManyWithoutRoadmapNestedInput
  }

  export type AnalysisEventUpsertWithWhereUniqueWithoutCareerAnalysisInput = {
    where: AnalysisEventWhereUniqueInput
    update: XOR<AnalysisEventUpdateWithoutCareerAnalysisInput, AnalysisEventUncheckedUpdateWithoutCareerAnalysisInput>
    create: XOR<AnalysisEventCreateWithoutCareerAnalysisInput, AnalysisEventUncheckedCreateWithoutCareerAnalysisInput>
  }

  export type AnalysisEventUpdateWithWhereUniqueWithoutCareerAnalysisInput = {
    where: AnalysisEventWhereUniqueInput
    data: XOR<AnalysisEventUpdateWithoutCareerAnalysisInput, AnalysisEventUncheckedUpdateWithoutCareerAnalysisInput>
  }

  export type AnalysisEventUpdateManyWithWhereWithoutCareerAnalysisInput = {
    where: AnalysisEventScalarWhereInput
    data: XOR<AnalysisEventUpdateManyMutationInput, AnalysisEventUncheckedUpdateManyWithoutCareerAnalysisInput>
  }

  export type AnalysisEventScalarWhereInput = {
    AND?: AnalysisEventScalarWhereInput | AnalysisEventScalarWhereInput[]
    OR?: AnalysisEventScalarWhereInput[]
    NOT?: AnalysisEventScalarWhereInput | AnalysisEventScalarWhereInput[]
    id?: UuidFilter<"AnalysisEvent"> | string
    careerAnalysisId?: UuidFilter<"AnalysisEvent"> | string
    type?: EnumAnalysisEventTypeFilter<"AnalysisEvent"> | $Enums.AnalysisEventType
    payload?: JsonNullableFilter<"AnalysisEvent">
    createdAt?: DateTimeFilter<"AnalysisEvent"> | Date | string
  }

  export type CareerAnalysisCreateWithoutEvidenceInput = {
    id?: string
    status?: $Enums.CareerAnalysisStatus
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutAnalysesInput
    resume: ResumeCreateNestedOneWithoutAnalysesInput
    role: RoleCreateNestedOneWithoutAnalysesInput
    gaps?: SkillGapCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisUncheckedCreateWithoutEvidenceInput = {
    id?: string
    userId: string
    status?: $Enums.CareerAnalysisStatus
    resumeId: string
    roleId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    gaps?: SkillGapUncheckedCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapUncheckedCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventUncheckedCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisCreateOrConnectWithoutEvidenceInput = {
    where: CareerAnalysisWhereUniqueInput
    create: XOR<CareerAnalysisCreateWithoutEvidenceInput, CareerAnalysisUncheckedCreateWithoutEvidenceInput>
  }

  export type SkillCreateWithoutEvidenceInput = {
    id?: string
    slug: string
    name: string
    aliases?: SkillCreatealiasesInput | string[]
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RoleSkillRequirementCreateNestedManyWithoutSkillInput
    gaps?: SkillGapCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateWithoutEvidenceInput = {
    id?: string
    slug: string
    name: string
    aliases?: SkillCreatealiasesInput | string[]
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RoleSkillRequirementUncheckedCreateNestedManyWithoutSkillInput
    gaps?: SkillGapUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillCreateOrConnectWithoutEvidenceInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutEvidenceInput, SkillUncheckedCreateWithoutEvidenceInput>
  }

  export type CareerAnalysisUpsertWithoutEvidenceInput = {
    update: XOR<CareerAnalysisUpdateWithoutEvidenceInput, CareerAnalysisUncheckedUpdateWithoutEvidenceInput>
    create: XOR<CareerAnalysisCreateWithoutEvidenceInput, CareerAnalysisUncheckedCreateWithoutEvidenceInput>
    where?: CareerAnalysisWhereInput
  }

  export type CareerAnalysisUpdateToOneWithWhereWithoutEvidenceInput = {
    where?: CareerAnalysisWhereInput
    data: XOR<CareerAnalysisUpdateWithoutEvidenceInput, CareerAnalysisUncheckedUpdateWithoutEvidenceInput>
  }

  export type CareerAnalysisUpdateWithoutEvidenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput
    resume?: ResumeUpdateOneRequiredWithoutAnalysesNestedInput
    role?: RoleUpdateOneRequiredWithoutAnalysesNestedInput
    gaps?: SkillGapUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateWithoutEvidenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gaps?: SkillGapUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUncheckedUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUncheckedUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type SkillUpsertWithoutEvidenceInput = {
    update: XOR<SkillUpdateWithoutEvidenceInput, SkillUncheckedUpdateWithoutEvidenceInput>
    create: XOR<SkillCreateWithoutEvidenceInput, SkillUncheckedCreateWithoutEvidenceInput>
    where?: SkillWhereInput
  }

  export type SkillUpdateToOneWithWhereWithoutEvidenceInput = {
    where?: SkillWhereInput
    data: XOR<SkillUpdateWithoutEvidenceInput, SkillUncheckedUpdateWithoutEvidenceInput>
  }

  export type SkillUpdateWithoutEvidenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    aliases?: SkillUpdatealiasesInput | string[]
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RoleSkillRequirementUpdateManyWithoutSkillNestedInput
    gaps?: SkillGapUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateWithoutEvidenceInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    aliases?: SkillUpdatealiasesInput | string[]
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RoleSkillRequirementUncheckedUpdateManyWithoutSkillNestedInput
    gaps?: SkillGapUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type CareerAnalysisCreateWithoutGapsInput = {
    id?: string
    status?: $Enums.CareerAnalysisStatus
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutAnalysesInput
    resume: ResumeCreateNestedOneWithoutAnalysesInput
    role: RoleCreateNestedOneWithoutAnalysesInput
    evidence?: CandidateSkillEvidenceCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisUncheckedCreateWithoutGapsInput = {
    id?: string
    userId: string
    status?: $Enums.CareerAnalysisStatus
    resumeId: string
    roleId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapUncheckedCreateNestedOneWithoutCareerAnalysisInput
    events?: AnalysisEventUncheckedCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisCreateOrConnectWithoutGapsInput = {
    where: CareerAnalysisWhereUniqueInput
    create: XOR<CareerAnalysisCreateWithoutGapsInput, CareerAnalysisUncheckedCreateWithoutGapsInput>
  }

  export type SkillCreateWithoutGapsInput = {
    id?: string
    slug: string
    name: string
    aliases?: SkillCreatealiasesInput | string[]
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RoleSkillRequirementCreateNestedManyWithoutSkillInput
    evidence?: CandidateSkillEvidenceCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateWithoutGapsInput = {
    id?: string
    slug: string
    name: string
    aliases?: SkillCreatealiasesInput | string[]
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    requirements?: RoleSkillRequirementUncheckedCreateNestedManyWithoutSkillInput
    evidence?: CandidateSkillEvidenceUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillCreateOrConnectWithoutGapsInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutGapsInput, SkillUncheckedCreateWithoutGapsInput>
  }

  export type RoadmapTaskCreateWithoutSkillGapInput = {
    id?: string
    weekNumber: number
    orderInWeek: number
    title: string
    description: string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
    roadmap: RoadmapCreateNestedOneWithoutTasksInput
  }

  export type RoadmapTaskUncheckedCreateWithoutSkillGapInput = {
    id?: string
    roadmapId: string
    weekNumber: number
    orderInWeek: number
    title: string
    description: string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RoadmapTaskCreateOrConnectWithoutSkillGapInput = {
    where: RoadmapTaskWhereUniqueInput
    create: XOR<RoadmapTaskCreateWithoutSkillGapInput, RoadmapTaskUncheckedCreateWithoutSkillGapInput>
  }

  export type RoadmapTaskCreateManySkillGapInputEnvelope = {
    data: RoadmapTaskCreateManySkillGapInput | RoadmapTaskCreateManySkillGapInput[]
    skipDuplicates?: boolean
  }

  export type CareerAnalysisUpsertWithoutGapsInput = {
    update: XOR<CareerAnalysisUpdateWithoutGapsInput, CareerAnalysisUncheckedUpdateWithoutGapsInput>
    create: XOR<CareerAnalysisCreateWithoutGapsInput, CareerAnalysisUncheckedCreateWithoutGapsInput>
    where?: CareerAnalysisWhereInput
  }

  export type CareerAnalysisUpdateToOneWithWhereWithoutGapsInput = {
    where?: CareerAnalysisWhereInput
    data: XOR<CareerAnalysisUpdateWithoutGapsInput, CareerAnalysisUncheckedUpdateWithoutGapsInput>
  }

  export type CareerAnalysisUpdateWithoutGapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput
    resume?: ResumeUpdateOneRequiredWithoutAnalysesNestedInput
    role?: RoleUpdateOneRequiredWithoutAnalysesNestedInput
    evidence?: CandidateSkillEvidenceUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateWithoutGapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUncheckedUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUncheckedUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type SkillUpsertWithoutGapsInput = {
    update: XOR<SkillUpdateWithoutGapsInput, SkillUncheckedUpdateWithoutGapsInput>
    create: XOR<SkillCreateWithoutGapsInput, SkillUncheckedCreateWithoutGapsInput>
    where?: SkillWhereInput
  }

  export type SkillUpdateToOneWithWhereWithoutGapsInput = {
    where?: SkillWhereInput
    data: XOR<SkillUpdateWithoutGapsInput, SkillUncheckedUpdateWithoutGapsInput>
  }

  export type SkillUpdateWithoutGapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    aliases?: SkillUpdatealiasesInput | string[]
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RoleSkillRequirementUpdateManyWithoutSkillNestedInput
    evidence?: CandidateSkillEvidenceUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateWithoutGapsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    aliases?: SkillUpdatealiasesInput | string[]
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requirements?: RoleSkillRequirementUncheckedUpdateManyWithoutSkillNestedInput
    evidence?: CandidateSkillEvidenceUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type RoadmapTaskUpsertWithWhereUniqueWithoutSkillGapInput = {
    where: RoadmapTaskWhereUniqueInput
    update: XOR<RoadmapTaskUpdateWithoutSkillGapInput, RoadmapTaskUncheckedUpdateWithoutSkillGapInput>
    create: XOR<RoadmapTaskCreateWithoutSkillGapInput, RoadmapTaskUncheckedCreateWithoutSkillGapInput>
  }

  export type RoadmapTaskUpdateWithWhereUniqueWithoutSkillGapInput = {
    where: RoadmapTaskWhereUniqueInput
    data: XOR<RoadmapTaskUpdateWithoutSkillGapInput, RoadmapTaskUncheckedUpdateWithoutSkillGapInput>
  }

  export type RoadmapTaskUpdateManyWithWhereWithoutSkillGapInput = {
    where: RoadmapTaskScalarWhereInput
    data: XOR<RoadmapTaskUpdateManyMutationInput, RoadmapTaskUncheckedUpdateManyWithoutSkillGapInput>
  }

  export type RoadmapTaskScalarWhereInput = {
    AND?: RoadmapTaskScalarWhereInput | RoadmapTaskScalarWhereInput[]
    OR?: RoadmapTaskScalarWhereInput[]
    NOT?: RoadmapTaskScalarWhereInput | RoadmapTaskScalarWhereInput[]
    id?: UuidFilter<"RoadmapTask"> | string
    roadmapId?: UuidFilter<"RoadmapTask"> | string
    skillGapId?: UuidNullableFilter<"RoadmapTask"> | string | null
    weekNumber?: IntFilter<"RoadmapTask"> | number
    orderInWeek?: IntFilter<"RoadmapTask"> | number
    title?: StringFilter<"RoadmapTask"> | string
    description?: StringFilter<"RoadmapTask"> | string
    resources?: JsonNullableFilter<"RoadmapTask">
    completed?: BoolFilter<"RoadmapTask"> | boolean
    completedAt?: DateTimeNullableFilter<"RoadmapTask"> | Date | string | null
    createdAt?: DateTimeFilter<"RoadmapTask"> | Date | string
  }

  export type CareerAnalysisCreateWithoutRoadmapInput = {
    id?: string
    status?: $Enums.CareerAnalysisStatus
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutAnalysesInput
    resume: ResumeCreateNestedOneWithoutAnalysesInput
    role: RoleCreateNestedOneWithoutAnalysesInput
    evidence?: CandidateSkillEvidenceCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapCreateNestedManyWithoutCareerAnalysisInput
    events?: AnalysisEventCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisUncheckedCreateWithoutRoadmapInput = {
    id?: string
    userId: string
    status?: $Enums.CareerAnalysisStatus
    resumeId: string
    roleId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapUncheckedCreateNestedManyWithoutCareerAnalysisInput
    events?: AnalysisEventUncheckedCreateNestedManyWithoutCareerAnalysisInput
  }

  export type CareerAnalysisCreateOrConnectWithoutRoadmapInput = {
    where: CareerAnalysisWhereUniqueInput
    create: XOR<CareerAnalysisCreateWithoutRoadmapInput, CareerAnalysisUncheckedCreateWithoutRoadmapInput>
  }

  export type RoadmapTaskCreateWithoutRoadmapInput = {
    id?: string
    weekNumber: number
    orderInWeek: number
    title: string
    description: string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
    skillGap?: SkillGapCreateNestedOneWithoutTasksInput
  }

  export type RoadmapTaskUncheckedCreateWithoutRoadmapInput = {
    id?: string
    skillGapId?: string | null
    weekNumber: number
    orderInWeek: number
    title: string
    description: string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RoadmapTaskCreateOrConnectWithoutRoadmapInput = {
    where: RoadmapTaskWhereUniqueInput
    create: XOR<RoadmapTaskCreateWithoutRoadmapInput, RoadmapTaskUncheckedCreateWithoutRoadmapInput>
  }

  export type RoadmapTaskCreateManyRoadmapInputEnvelope = {
    data: RoadmapTaskCreateManyRoadmapInput | RoadmapTaskCreateManyRoadmapInput[]
    skipDuplicates?: boolean
  }

  export type CareerAnalysisUpsertWithoutRoadmapInput = {
    update: XOR<CareerAnalysisUpdateWithoutRoadmapInput, CareerAnalysisUncheckedUpdateWithoutRoadmapInput>
    create: XOR<CareerAnalysisCreateWithoutRoadmapInput, CareerAnalysisUncheckedCreateWithoutRoadmapInput>
    where?: CareerAnalysisWhereInput
  }

  export type CareerAnalysisUpdateToOneWithWhereWithoutRoadmapInput = {
    where?: CareerAnalysisWhereInput
    data: XOR<CareerAnalysisUpdateWithoutRoadmapInput, CareerAnalysisUncheckedUpdateWithoutRoadmapInput>
  }

  export type CareerAnalysisUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput
    resume?: ResumeUpdateOneRequiredWithoutAnalysesNestedInput
    role?: RoleUpdateOneRequiredWithoutAnalysesNestedInput
    evidence?: CandidateSkillEvidenceUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUpdateManyWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUncheckedUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type RoadmapTaskUpsertWithWhereUniqueWithoutRoadmapInput = {
    where: RoadmapTaskWhereUniqueInput
    update: XOR<RoadmapTaskUpdateWithoutRoadmapInput, RoadmapTaskUncheckedUpdateWithoutRoadmapInput>
    create: XOR<RoadmapTaskCreateWithoutRoadmapInput, RoadmapTaskUncheckedCreateWithoutRoadmapInput>
  }

  export type RoadmapTaskUpdateWithWhereUniqueWithoutRoadmapInput = {
    where: RoadmapTaskWhereUniqueInput
    data: XOR<RoadmapTaskUpdateWithoutRoadmapInput, RoadmapTaskUncheckedUpdateWithoutRoadmapInput>
  }

  export type RoadmapTaskUpdateManyWithWhereWithoutRoadmapInput = {
    where: RoadmapTaskScalarWhereInput
    data: XOR<RoadmapTaskUpdateManyMutationInput, RoadmapTaskUncheckedUpdateManyWithoutRoadmapInput>
  }

  export type RoadmapCreateWithoutTasksInput = {
    id?: string
    weekCount?: number
    createdAt?: Date | string
    careerAnalysis: CareerAnalysisCreateNestedOneWithoutRoadmapInput
  }

  export type RoadmapUncheckedCreateWithoutTasksInput = {
    id?: string
    careerAnalysisId: string
    weekCount?: number
    createdAt?: Date | string
  }

  export type RoadmapCreateOrConnectWithoutTasksInput = {
    where: RoadmapWhereUniqueInput
    create: XOR<RoadmapCreateWithoutTasksInput, RoadmapUncheckedCreateWithoutTasksInput>
  }

  export type SkillGapCreateWithoutTasksInput = {
    id?: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
    careerAnalysis: CareerAnalysisCreateNestedOneWithoutGapsInput
    skill: SkillCreateNestedOneWithoutGapsInput
  }

  export type SkillGapUncheckedCreateWithoutTasksInput = {
    id?: string
    careerAnalysisId: string
    skillId: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
  }

  export type SkillGapCreateOrConnectWithoutTasksInput = {
    where: SkillGapWhereUniqueInput
    create: XOR<SkillGapCreateWithoutTasksInput, SkillGapUncheckedCreateWithoutTasksInput>
  }

  export type RoadmapUpsertWithoutTasksInput = {
    update: XOR<RoadmapUpdateWithoutTasksInput, RoadmapUncheckedUpdateWithoutTasksInput>
    create: XOR<RoadmapCreateWithoutTasksInput, RoadmapUncheckedCreateWithoutTasksInput>
    where?: RoadmapWhereInput
  }

  export type RoadmapUpdateToOneWithWhereWithoutTasksInput = {
    where?: RoadmapWhereInput
    data: XOR<RoadmapUpdateWithoutTasksInput, RoadmapUncheckedUpdateWithoutTasksInput>
  }

  export type RoadmapUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    careerAnalysis?: CareerAnalysisUpdateOneRequiredWithoutRoadmapNestedInput
  }

  export type RoadmapUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    weekCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillGapUpsertWithoutTasksInput = {
    update: XOR<SkillGapUpdateWithoutTasksInput, SkillGapUncheckedUpdateWithoutTasksInput>
    create: XOR<SkillGapCreateWithoutTasksInput, SkillGapUncheckedCreateWithoutTasksInput>
    where?: SkillGapWhereInput
  }

  export type SkillGapUpdateToOneWithWhereWithoutTasksInput = {
    where?: SkillGapWhereInput
    data: XOR<SkillGapUpdateWithoutTasksInput, SkillGapUncheckedUpdateWithoutTasksInput>
  }

  export type SkillGapUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    careerAnalysis?: CareerAnalysisUpdateOneRequiredWithoutGapsNestedInput
    skill?: SkillUpdateOneRequiredWithoutGapsNestedInput
  }

  export type SkillGapUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareerAnalysisCreateWithoutEventsInput = {
    id?: string
    status?: $Enums.CareerAnalysisStatus
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutAnalysesInput
    resume: ResumeCreateNestedOneWithoutAnalysesInput
    role: RoleCreateNestedOneWithoutAnalysesInput
    evidence?: CandidateSkillEvidenceCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapCreateNestedOneWithoutCareerAnalysisInput
  }

  export type CareerAnalysisUncheckedCreateWithoutEventsInput = {
    id?: string
    userId: string
    status?: $Enums.CareerAnalysisStatus
    resumeId: string
    roleId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedCreateNestedManyWithoutCareerAnalysisInput
    gaps?: SkillGapUncheckedCreateNestedManyWithoutCareerAnalysisInput
    roadmap?: RoadmapUncheckedCreateNestedOneWithoutCareerAnalysisInput
  }

  export type CareerAnalysisCreateOrConnectWithoutEventsInput = {
    where: CareerAnalysisWhereUniqueInput
    create: XOR<CareerAnalysisCreateWithoutEventsInput, CareerAnalysisUncheckedCreateWithoutEventsInput>
  }

  export type CareerAnalysisUpsertWithoutEventsInput = {
    update: XOR<CareerAnalysisUpdateWithoutEventsInput, CareerAnalysisUncheckedUpdateWithoutEventsInput>
    create: XOR<CareerAnalysisCreateWithoutEventsInput, CareerAnalysisUncheckedCreateWithoutEventsInput>
    where?: CareerAnalysisWhereInput
  }

  export type CareerAnalysisUpdateToOneWithWhereWithoutEventsInput = {
    where?: CareerAnalysisWhereInput
    data: XOR<CareerAnalysisUpdateWithoutEventsInput, CareerAnalysisUncheckedUpdateWithoutEventsInput>
  }

  export type CareerAnalysisUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput
    resume?: ResumeUpdateOneRequiredWithoutAnalysesNestedInput
    role?: RoleUpdateOneRequiredWithoutAnalysesNestedInput
    evidence?: CandidateSkillEvidenceUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUpdateOneWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUncheckedUpdateOneWithoutCareerAnalysisNestedInput
  }

  export type ResumeCreateManyUserInput = {
    id?: string
    title: string
    originalFileName: string
    mimeType: string
    fileSize: number
    fileUrl: string
    filePath?: string | null
    rawText: string
    structuredResume: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RefreshTokenCreateManyUserInput = {
    id?: string
    familyId: string
    tokenHash: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type CareerAnalysisCreateManyUserInput = {
    id?: string
    status?: $Enums.CareerAnalysisStatus
    resumeId: string
    roleId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ResumeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileUrl?: StringFieldUpdateOperationsInput | string
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    rawText?: StringFieldUpdateOperationsInput | string
    structuredResume?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analyses?: CareerAnalysisUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileUrl?: StringFieldUpdateOperationsInput | string
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    rawText?: StringFieldUpdateOperationsInput | string
    structuredResume?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analyses?: CareerAnalysisUncheckedUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    fileUrl?: StringFieldUpdateOperationsInput | string
    filePath?: NullableStringFieldUpdateOperationsInput | string | null
    rawText?: StringFieldUpdateOperationsInput | string
    structuredResume?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    familyId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefreshTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    familyId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    familyId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CareerAnalysisUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume?: ResumeUpdateOneRequiredWithoutAnalysesNestedInput
    role?: RoleUpdateOneRequiredWithoutAnalysesNestedInput
    evidence?: CandidateSkillEvidenceUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUncheckedUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUncheckedUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeId?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CareerAnalysisCreateManyResumeInput = {
    id?: string
    userId: string
    status?: $Enums.CareerAnalysisStatus
    roleId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type CareerAnalysisUpdateWithoutResumeInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput
    role?: RoleUpdateOneRequiredWithoutAnalysesNestedInput
    evidence?: CandidateSkillEvidenceUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateWithoutResumeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    roleId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUncheckedUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUncheckedUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateManyWithoutResumeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    roleId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoleSkillRequirementCreateManySkillInput = {
    id?: string
    roleId: string
    importance: $Enums.SkillImportance
    rationale: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CandidateSkillEvidenceCreateManySkillInput = {
    id?: string
    careerAnalysisId: string
    strength: $Enums.EvidenceStrength
    quote: string
    sourceSection: string
    sourceLabel: string
    createdAt?: Date | string
  }

  export type SkillGapCreateManySkillInput = {
    id?: string
    careerAnalysisId: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
  }

  export type RoleSkillRequirementUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    importance?: EnumSkillImportanceFieldUpdateOperationsInput | $Enums.SkillImportance
    rationale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutRequirementsNestedInput
  }

  export type RoleSkillRequirementUncheckedUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    importance?: EnumSkillImportanceFieldUpdateOperationsInput | $Enums.SkillImportance
    rationale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleSkillRequirementUncheckedUpdateManyWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    importance?: EnumSkillImportanceFieldUpdateOperationsInput | $Enums.SkillImportance
    rationale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CandidateSkillEvidenceUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    strength?: EnumEvidenceStrengthFieldUpdateOperationsInput | $Enums.EvidenceStrength
    quote?: StringFieldUpdateOperationsInput | string
    sourceSection?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    careerAnalysis?: CareerAnalysisUpdateOneRequiredWithoutEvidenceNestedInput
  }

  export type CandidateSkillEvidenceUncheckedUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    strength?: EnumEvidenceStrengthFieldUpdateOperationsInput | $Enums.EvidenceStrength
    quote?: StringFieldUpdateOperationsInput | string
    sourceSection?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CandidateSkillEvidenceUncheckedUpdateManyWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    strength?: EnumEvidenceStrengthFieldUpdateOperationsInput | $Enums.EvidenceStrength
    quote?: StringFieldUpdateOperationsInput | string
    sourceSection?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillGapUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    careerAnalysis?: CareerAnalysisUpdateOneRequiredWithoutGapsNestedInput
    tasks?: RoadmapTaskUpdateManyWithoutSkillGapNestedInput
  }

  export type SkillGapUncheckedUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: RoadmapTaskUncheckedUpdateManyWithoutSkillGapNestedInput
  }

  export type SkillGapUncheckedUpdateManyWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    careerAnalysisId?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleSkillRequirementCreateManyRoleInput = {
    id?: string
    skillId: string
    importance: $Enums.SkillImportance
    rationale: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CareerAnalysisCreateManyRoleInput = {
    id?: string
    userId: string
    status?: $Enums.CareerAnalysisStatus
    resumeId: string
    resumeSnapshot: JsonNullValueInput | InputJsonValue
    roleSnapshot: JsonNullValueInput | InputJsonValue
    readinessScore?: number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type RoleSkillRequirementUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    importance?: EnumSkillImportanceFieldUpdateOperationsInput | $Enums.SkillImportance
    rationale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skill?: SkillUpdateOneRequiredWithoutRequirementsNestedInput
  }

  export type RoleSkillRequirementUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    importance?: EnumSkillImportanceFieldUpdateOperationsInput | $Enums.SkillImportance
    rationale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleSkillRequirementUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    importance?: EnumSkillImportanceFieldUpdateOperationsInput | $Enums.SkillImportance
    rationale?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CareerAnalysisUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAnalysesNestedInput
    resume?: ResumeUpdateOneRequiredWithoutAnalysesNestedInput
    evidence?: CandidateSkillEvidenceUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    evidence?: CandidateSkillEvidenceUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    gaps?: SkillGapUncheckedUpdateManyWithoutCareerAnalysisNestedInput
    roadmap?: RoadmapUncheckedUpdateOneWithoutCareerAnalysisNestedInput
    events?: AnalysisEventUncheckedUpdateManyWithoutCareerAnalysisNestedInput
  }

  export type CareerAnalysisUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumCareerAnalysisStatusFieldUpdateOperationsInput | $Enums.CareerAnalysisStatus
    resumeId?: StringFieldUpdateOperationsInput | string
    resumeSnapshot?: JsonNullValueInput | InputJsonValue
    roleSnapshot?: JsonNullValueInput | InputJsonValue
    readinessScore?: NullableIntFieldUpdateOperationsInput | number | null
    readinessBreakdown?: NullableJsonNullValueInput | InputJsonValue
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CandidateSkillEvidenceCreateManyCareerAnalysisInput = {
    id?: string
    skillId: string
    strength: $Enums.EvidenceStrength
    quote: string
    sourceSection: string
    sourceLabel: string
    createdAt?: Date | string
  }

  export type SkillGapCreateManyCareerAnalysisInput = {
    id?: string
    skillId: string
    status: $Enums.GapStatus
    priority: number
    reasoning: string
    createdAt?: Date | string
  }

  export type AnalysisEventCreateManyCareerAnalysisInput = {
    id?: string
    type: $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type CandidateSkillEvidenceUpdateWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    strength?: EnumEvidenceStrengthFieldUpdateOperationsInput | $Enums.EvidenceStrength
    quote?: StringFieldUpdateOperationsInput | string
    sourceSection?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skill?: SkillUpdateOneRequiredWithoutEvidenceNestedInput
  }

  export type CandidateSkillEvidenceUncheckedUpdateWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    strength?: EnumEvidenceStrengthFieldUpdateOperationsInput | $Enums.EvidenceStrength
    quote?: StringFieldUpdateOperationsInput | string
    sourceSection?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CandidateSkillEvidenceUncheckedUpdateManyWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    strength?: EnumEvidenceStrengthFieldUpdateOperationsInput | $Enums.EvidenceStrength
    quote?: StringFieldUpdateOperationsInput | string
    sourceSection?: StringFieldUpdateOperationsInput | string
    sourceLabel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillGapUpdateWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skill?: SkillUpdateOneRequiredWithoutGapsNestedInput
    tasks?: RoadmapTaskUpdateManyWithoutSkillGapNestedInput
  }

  export type SkillGapUncheckedUpdateWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: RoadmapTaskUncheckedUpdateManyWithoutSkillGapNestedInput
  }

  export type SkillGapUncheckedUpdateManyWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    status?: EnumGapStatusFieldUpdateOperationsInput | $Enums.GapStatus
    priority?: IntFieldUpdateOperationsInput | number
    reasoning?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisEventUpdateWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnalysisEventTypeFieldUpdateOperationsInput | $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisEventUncheckedUpdateWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnalysisEventTypeFieldUpdateOperationsInput | $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisEventUncheckedUpdateManyWithoutCareerAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAnalysisEventTypeFieldUpdateOperationsInput | $Enums.AnalysisEventType
    payload?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTaskCreateManySkillGapInput = {
    id?: string
    roadmapId: string
    weekNumber: number
    orderInWeek: number
    title: string
    description: string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RoadmapTaskUpdateWithoutSkillGapInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    orderInWeek?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roadmap?: RoadmapUpdateOneRequiredWithoutTasksNestedInput
  }

  export type RoadmapTaskUncheckedUpdateWithoutSkillGapInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    orderInWeek?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTaskUncheckedUpdateManyWithoutSkillGapInput = {
    id?: StringFieldUpdateOperationsInput | string
    roadmapId?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    orderInWeek?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTaskCreateManyRoadmapInput = {
    id?: string
    skillGapId?: string | null
    weekNumber: number
    orderInWeek: number
    title: string
    description: string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RoadmapTaskUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekNumber?: IntFieldUpdateOperationsInput | number
    orderInWeek?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skillGap?: SkillGapUpdateOneWithoutTasksNestedInput
  }

  export type RoadmapTaskUncheckedUpdateWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    skillGapId?: NullableStringFieldUpdateOperationsInput | string | null
    weekNumber?: IntFieldUpdateOperationsInput | number
    orderInWeek?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoadmapTaskUncheckedUpdateManyWithoutRoadmapInput = {
    id?: StringFieldUpdateOperationsInput | string
    skillGapId?: NullableStringFieldUpdateOperationsInput | string | null
    weekNumber?: IntFieldUpdateOperationsInput | number
    orderInWeek?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    resources?: NullableJsonNullValueInput | InputJsonValue
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}