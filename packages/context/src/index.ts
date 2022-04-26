import type { ModalBuilder } from '@discordjs/builders';
import type { APIGuildMember, APIMessage } from 'discord-api-types/v10';
import {
    ActionRow,
    ApplicationCommand,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    Attachment,
    AwaitMessageComponentOptions,
    AwaitModalSubmitOptions,
    AwaitReactionsOptions,
    ChatInputCommandInteraction,
    Client,
    ClientApplication,
    Collection,
    CommandInteractionOption,
    CommandInteractionOptionResolver,
    DMChannel,
    Embed,
    EmojiIdentifierResolvable,
    Guild,
    GuildChannel,
    GuildMember,
    InteractionCollector,
    InteractionDeferReplyOptions,
    InteractionReplyOptions,
    InteractionResponse,
    InteractionType,
    InteractionWebhook,
    Locale,
    Message,
    MessageActionRowComponent,
    MessageActivity,
    MessageComponentCollectorOptions,
    MessageComponentInteraction,
    MessageEditOptions,
    MessageFlagsBitField,
    MessageInteraction,
    MessageMentions,
    MessagePayload,
    MessageReaction,
    MessageReference,
    MessageType,
    ModalData,
    ModalSubmitInteraction,
    NewsChannel,
    PermissionsBitField,
    ReactionCollector,
    ReactionCollectorOptions,
    ReactionManager,
    ReplyMessageOptions,
    Snowflake,
    Sticker,
    TextBasedChannel,
    TextChannel,
    ThreadChannel,
    ThreadCreateOptions,
    User,
    Webhook,
    WebhookEditMessageOptions,
} from 'discord.js';

const _deferred = Symbol('deferred');
const _replied = Symbol('replied');
const _replies = Symbol('replies');
const _reply = Symbol('reply');

export class Context {
    /**
     * The parent message or interaction
     */
    public parent: ChatInputCommandInteraction | Message;

    private [_deferred] = false;
    private [_replied] = false;
    private [_replies] = new Collection<Snowflake, Message | null>();

    public constructor(parent: ChatInputCommandInteraction | Message) {
        // Ensure the parent is a Message or a ChatInput
        if (parent instanceof ChatInputCommandInteraction === parent instanceof Message) {
            throw new TypeError('Parent must be a `ChatInputCommandInteraction` or `Message`');
        }

        this.parent = parent;
    }

    /**
     * @interaction Always null
     * @message Group activity
     */
    public get activity(): MessageActivity | null {
        if (this.parent instanceof Message) {
            return this.parent.activity;
        }
        return null;
    }

    /**
     * @interaction The client application id
     * @message The client application id
     */
    public get applicationId(): Snowflake | null {
        return this.parent.applicationId;
    }

    /**
     * @interaction A collection of attachments in the interaction options, mapped by their option name
     * @message A collection of attachments in the message, mapped by id
     */
    public get attachments(): Collection<Snowflake | string, Attachment | undefined> {
        if (this.parent instanceof Message) return this.parent.attachments;

        // Map the interaction attachments options by their option names
        const attachmentType = ApplicationCommandOptionType.Attachment;
        const hoistedOptions = (this.parent.options as any)
            ._hoistedOptions as CommandInteractionOption[];
        const attachments: [string, Attachment | undefined][] = hoistedOptions
            .filter((opt) => opt.type === attachmentType)
            .map((opt) => [opt.name, opt.attachment]);
        const collection = new Collection<string, Attachment | undefined>(attachments);
        return collection;
    }

    /**
     * @interaction The user which sent this interaction
     * @message The author of the message
     */
    public get author(): User {
        if (this.parent instanceof Message) return this.parent.author;
        return this.parent.user;
    }

    /**
     * @interaction The channel the interaction was evoked in
     * @message The channel the message was sent in
     */
    public get channel():
        | TextChannel
        | DMChannel
        | NewsChannel
        | ThreadChannel
        | TextBasedChannel
        | null {
        return this.parent.channel;
    }

    /**
     * @interaction Returns a string representation of the command interaction
     * @message The message contents with all mentions replaced by the equivalent text
     */
    public get cleanContent(): string {
        if (this.parent instanceof Message) return this.parent.cleanContent;
        return this.parent.toString();
    }

    /**
     * @interaction The id of the channel the interaction was evoked in
     * @message The id of the channel the message was sent in
     */
    public get channelId(): Snowflake {
        return this.parent.channelId;
    }

    /**
     * @interaction The client that instantiated this
     * @message The client that instantiated this
     */
    public get client(): Client {
        return this.parent.client;
    }

    /**
     * @interaction The invoked application command, if it was fetched before
     * @message Always null
     */
    public get command(): ApplicationCommand | null {
        if (this.parent instanceof Message) return null;
        return this.parent.command;
    }

    /**
     * @interaction The invoked application command's id
     * @message An empty string
     */
    public get commandId(): Snowflake | string {
        return Reflect.get(this.parent, 'commandId') ?? '';
    }

    /**
     * @interaction The invoked application command's name
     * @message An empty string
     */
    public get commandName(): string {
        return Reflect.get(this.parent, 'commandName') ?? '';
    }

    /**
     * @interaction The invoked application command's type
     * @message 0
     */
    public get commandType(): ApplicationCommandType | 0 {
        return Reflect.get(this.parent, 'commandType') ?? 0;
    }

    /**
     * @interaction An empty array
     * @message A list of ActionRows in the message
     */
    public get components(): Array<ActionRow<any>> {
        return Reflect.get(this.parent, 'components') ?? [];
    }

    /**
     * @interaction Returns a string representation of the command interaction
     * @message The content of the message
     */
    public get content(): string {
        return Reflect.get(this.parent, 'content') ?? '';
    }

    /**
     * @interaction The time the interaction was created at
     * @message The time the message was sent at
     */
    public get createdAt(): Date {
        return this.parent.createdAt;
    }

    /**
     * @interaction The timestamp the interaction was created at
     * @message The timestamp the message was sent at
     */
    public get createdTimestamp(): number {
        return this.parent.createdTimestamp;
    }

    /**
     * @interaction Always false
     * @message Whether the message is crosspostable by the client user
     */
    public get crosspostable(): boolean {
        return Reflect.get(this.parent, 'crosspostable') ?? false;
    }

    /**
     * @interaction Whether the reply to this interaction has been deferred
     * @message Whether the client sent typing to the message's channel
     */
    public get deferred(): boolean {
        return Reflect.get(this.parent, 'deferred') ?? this[_deferred];
    }

    /**
     * @interaction Always false
     * @message Whether the message is deletable by the client user
     */
    public get deletable(): boolean {
        return Reflect.get(this.parent, 'deletable') ?? false;
    }

    /**
     * @interaction Always false
     * @message Whether the message is editable by the client user
     */
    public get editable(): boolean {
        return Reflect.get(this.parent, 'editable') ?? false;
    }

    /**
     * @interaction Always null
     * @message The time the message was last edited at (if applicable)
     */
    public get editedAt(): Date | null {
        return Reflect.get(this.parent, 'editedAt') ?? null;
    }

    /**
     * @interaction Always null
     * @message The timestamp the message was last edited at (if applicable)
     */
    public get editedTimestamp(): number | null {
        return Reflect.get(this.parent, 'editedTimestamp') ?? null;
    }

    /**
     * @interaction An empty array
     * @message A list of embeds in the message - e.g. YouTube Player
     */
    public get embeds(): Array<Embed> {
        return Reflect.get(this.parent, 'embeds') ?? [];
    }

    /**
     * @interaction Whether the reply to this interaction is ephemeral
     * @message Always false
     */
    public get ephemeral(): boolean {
        return Reflect.get(this.parent, 'ephemeral') ?? false;
    }

    /**
     * @interaction Always empty bitfield
     * @message Flags that are applied to the message
     */
    public get flags(): MessageFlagsBitField {
        return Reflect.get(this.parent, 'flags') ?? new MessageFlagsBitField(0);
    }

    /**
     * @interaction Always null
     * @message Supplemental application information for group activities
     */
    public get groupActivityApplication(): ClientApplication | null {
        return Reflect.get(this.parent, 'groupActivityApplication') ?? null;
    }

    /**
     * @interaction The guild this interaction was sent in
     * @message The guild the message was sent in (if in a guild channel)
     */
    public get guild(): Guild | null {
        return this.parent.guild;
    }

    /**
     * @interaction The id of the guild this interaction was sent in
     * @message The id of the guild the message was sent in, if any
     */
    public get guildId(): Snowflake | null {
        return this.parent.guildId;
    }

    /**
     * @interaction The preferred locale from the guild this interaction was sent in
     * @message The perferred locale of the guild this message was send in, if any
     */
    public get guildLocale(): Locale | undefined | null {
        if (this.parent instanceof Message) return this.guild?.preferredLocale;
        return this.parent.guildLocale;
    }

    /**
     * @interaction Always false
     * @message Whether this message has a thread associated with it
     */
    public get hasThread(): boolean {
        return Reflect.get(this.parent, 'hasThread') ?? false;
    }

    /**
     * @interaction The interaction's id
     * @message The message's id
     */
    public get id(): Snowflake {
        return this.parent.id;
    }

    /**
     * @interaction Always null
     * @message Partial data of the interaction that this message is a reply to
     */
    public get interaction(): MessageInteraction | null {
        return Reflect.get(this.parent, 'interaction') ?? null;
    }

    /**
     * @interaction The locale of the user who invoked this interaction
     * @message Always null
     */
    public get locale(): Locale | null {
        return Reflect.get(this.parent, 'locale') ?? null;
    }

    /**
     * @interaction If this interaction was sent in a guild, the member which sent it
     * @message Represents the author of the message as a guild member. Only available if the message
     * comes from a guild where the author is still a member
     */
    public get member(): GuildMember | APIGuildMember | null {
        return this.parent.member;
    }

    /**
     * @interaction The permissions of the member, if one exists, in the channel this interaction was
     * executed in
     * @message The permissions of the member, in the channel this message was sent in, if applicable
     */
    public get memberPermissions(): PermissionsBitField | undefined | null {
        if (this.parent instanceof Message) {
            // If we have both channel and member objects, check for member permission in channel
            if (this.channel instanceof TextChannel && this.member instanceof GuildMember) {
                return this.channel?.permissionsFor(this.member);
            }
            // If we only have the member object, check for member permissions in channel by id
            if (this.member instanceof GuildMember) {
                return this.member.permissionsIn(this.channelId);
            }
            return undefined;
        }
        return this.parent.memberPermissions;
    }

    /**
     * @interaction Always empty MessageMentions object
     * @message All valid mentions that the message contains
     */
    public get mentions(): MessageMentions | null {
        // @ts-ignore Access private class
        return Reflect.get(this.parent, 'mentions') ?? new MessageMentions(this.parent);
    }

    /**
     * @interaction Always null
     * @message A random number or string used for checking message delivery,
     * this is only received after the message was sent successfully, and lost if re-fetched
     */
    public get nonce(): string | null {
        return Reflect.get(this.parent, 'nonce') ?? null;
    }

    /**
     * @interaction The options passed to the command
     * @message Always an empty CommandInteractionOptionResolver object
     */
    public get options(): CommandInteractionOptionResolver | undefined {
        if (this.parent instanceof Message) {
            // @ts-ignore Access a private class
            return new CommandInteractionOptionResolver(this.client, [], {});
        }
        // @ts-ignore Bypass
        return this.parent.options;
    }

    /**
     * @interaction Always false
     * @message Whether or not this message is a partial
     */
    public get partial(): boolean {
        return Reflect.get(this.parent, 'partial') ?? false;
    }

    /**
     * @interaction Always false
     * @message Whether the message is pinnable by the client user
     */
    public get pinnable(): boolean {
        return Reflect.get(this.parent, 'pinnable') ?? false;
    }

    /**
     * @interaction Always false
     * @message Whether or not this message is pinned
     */
    public get pinned(): boolean {
        return Reflect.get(this.parent, 'pinned') ?? false;
    }

    /**
     * @interaction Always an empty ReactionManager object
     * @message A manager of the reactions belonging to this message
     */
    public get reactions(): ReactionManager {
        if (this.parent instanceof Message) return this.parent.reactions;

        // @ts-ignore Access a private class
        const reactions = new ReactionManager(this.parent);
        // Replace the removeAll method to prevent errors
        reactions.removeAll = () => this.parent;
        return reactions;
    }

    /**
     * @interaction Always null
     * @message Message reference data
     */
    public get reference(): MessageReference | null {
        return Reflect.get(this.parent, 'reference') ?? null;
    }

    /**
     * @interaction Whether this interaction has already been replied to
     * @message Whether the client has already replied to the message
     */
    public get replied(): boolean {
        return Reflect.get(this.parent, 'replied') ?? this[_replied] ?? false;
    }

    /**
     * @interaction Always an empty Collection object
     * @message A collection of stickers in the message
     */
    public get stickers(): Collection<Snowflake, Sticker> {
        return Reflect.get(this.parent, 'stickers') ?? new Collection();
    }

    /**
     * @interaction Always false
     * @message Whether or not this message was sent by Discord, not actually a
     * user (e.g. pin notifications)
     */
    public get system(): boolean {
        return Reflect.get(this.parent, 'system') ?? false;
    }

    /**
     * @interaction Always null
     * @message The thread started by this message
     */
    public get thread(): ThreadChannel | null {
        return Reflect.get(this.parent, 'thread') ?? null;
    }

    /**
     * @interaction The interaction's token
     * @message An empty string
     */
    public get token(): string {
        return Reflect.get(this.parent, 'token') ?? '';
    }

    /**
     * @interaction Always false
     * @message Whether or not the message was Text-To-Speech
     */
    public get tts(): boolean {
        return Reflect.get(this.parent, 'tts') ?? false;
    }

    /**
     * @interaction The interaction's type
     * @message The type of the message
     */
    public get type(): MessageType | InteractionType {
        return this.parent.type;
    }

    /**
     * @interaction An empty string
     * @message The URL to jump to this message
     */
    public get url(): string {
        return Reflect.get(this.parent, 'url') ?? '';
    }

    /**
     * @interaction The user which sent this interaction
     * @message The author of the message
     */
    public get user(): User {
        return this.author;
    }

    /**
     * @interaction The version
     * @message Always 0
     */
    public get version(): number {
        return Reflect.get(this.parent, 'version') ?? 0;
    }

    /**
     * @interaction An associated interaction webhook, can be used to further
     * interact with this
     * interaction
     * @message Always null
     */
    public get webhook(): InteractionWebhook | null {
        return Reflect.get(this.parent, 'webhook') ?? null;
    }

    /**
     * @interaction The id of the associated interaction webhook
     * @message The id of the webhook that sent the message, if applicable
     */
    public get webhookId(): Snowflake | null {
        if (this.parent instanceof Message) return this.parent.webhookId;
        return this.parent.webhook.id;
    }

    /**
     * @interaction Always returns null
     * @message Collects a single component interaction that passes the filter.
     * The Promise will reject if the time expires
     * @param {AwaitMessageComponentOptions} [options={}] Options to pass to the
     * internal collector
     * @returns {Promise<MessageComponentInteraction|null>}
     */
    public async awaitMessageComponent(
        options: AwaitMessageComponentOptions<any> = {},
    ): Promise<MessageComponentInteraction | null> {
        if (this.parent instanceof ChatInputCommandInteraction) return null;
        return this.parent.awaitMessageComponent(options as any);
    }

    /**
     * @interaction Collects a single modal submit interaction that passes the
     * filter. The Promise will reject if the time expires
     * @message Always returns null
     * @param {AwaitModalSubmitOptions} [options] Options to pass to the
     * internal collector
     * @returns {Promise<ModalSubmitInteraction|null>}
     */
    public async awaitModalSubmit(
        options: AwaitModalSubmitOptions<any>,
    ): Promise<ModalSubmitInteraction | null> {
        if (this.parent instanceof Message) return null;
        return this.parent.awaitModalSubmit(options);
    }

    /**
     * @interaction Always returns null
     * @message Similar to createReactionCollector but in promise form.
     * Resolves with a collection of reactions that pass the specified filter
     * @param {AwaitReactionsOptions} [options={}] Optional options to pass to
     * the internal collector
     * @returns {Promise<Collection<Snowflake|string,MessageReaction>|null>}
     */
    public async awaitReactions(
        options: AwaitReactionsOptions = {},
    ): Promise<Collection<Snowflake | string, MessageReaction> | null> {
        if (this.parent instanceof ChatInputCommandInteraction) return null;
        return this.parent.awaitReactions(options);
    }

    /**
     * @interaction Always returns null
     * @message Creates a message component interaction collector
     * @param {MessageComponentCollectorOptions} [options={}] Options to send to
     * the collector
     * @returns {Promise<InteractionCollector<MessageComponentInteraction>|null>}
     */
    public async createMessageComponentCollector(
        options: MessageComponentCollectorOptions<any> = {},
    ): Promise<InteractionCollector<MessageComponentInteraction> | null> {
        if (this.parent instanceof ChatInputCommandInteraction) return null;
        return this.parent.createMessageComponentCollector(options as any);
    }

    /**
     * @interaction Always returns null
     * @message Creates a reaction collector
     * @param {ReactionCollectorOptions} [options={}] Options to send to the
     * collector
     * @returns {Promise<ReactionCollector<MessageReaction>|null>}
     */
    public async createReactionCollector(
        options: ReactionCollectorOptions = {},
    ): Promise<ReactionCollector | null> {
        if (this.parent instanceof ChatInputCommandInteraction) return null;
        return this.parent.createReactionCollector(options);
    }

    /**
     * @interaction Always returns null
     * @message Publishes a message in an announcement channel to all channels
     * following it
     * @returns {Promise<Message|null>}
     */
    public async crosspost(): Promise<Message | null> {
        if (this.parent instanceof ChatInputCommandInteraction) return null;
        return this.parent.crosspost();
    }

    /**
     * @interaction Defers the reply to this interaction
     * @message Starts typing in the channel this message was sent in
     * @param {InteractionDeferReplyOptions} [options={}] Options for deferring
     * the reply to this interaction
     * @returns {Promise<Message|APIMessage|InteractionResponse|null|undefined>}
     */
    public async deferReply(
        options: InteractionDeferReplyOptions = {},
    ): Promise<Message | APIMessage | InteractionResponse | null | undefined> {
        if (this.deferred || this.replied)
            throw new Error('The reply to this has already been sent or deferred');

        this[_deferred] = true;
        if (this.parent instanceof Message) {
            void (await this.channel?.sendTyping());
            return undefined;
        }
        return this.parent.deferReply(options);
    }

    /**
     * @interaction Always returns null
     * @message Deletes the message
     * @returns {Promise<Message|null>}
     */
    public async delete(): Promise<Message | null> {
        if (this.parent instanceof Message) return this.parent.delete();
        return null;
    }

    /**
     * @interaction Deletes the initial reply to this interaction
     * @message Deletes the client's first reply to this message
     * @returns {Promise<Message|undefined}
     */
    public async deleteReply(): Promise<Message | undefined> {
        if (this.ephemeral) throw new Error('Ephemeral responses cannot be deleted');
        else if (!this.replied && !this.deferred)
            throw new Error('The reply to this context has not been sent or deferred.');

        if (this.parent instanceof Message) {
            if (this.replied) {
                const reply = this[_replies].first();
                return reply?.delete();
            }
        } else void (await this.parent.deleteReply());
        return undefined;
    }

    /**
     * @interaction Always returns null
     * @message Edits the content of the message
     * @param {string|MessagePayload|MessageOptions} options The options to
     * provide
     * @returns {Promise<Message|null>}
     */
    public async edit(
        options: string | MessagePayload | MessageEditOptions,
    ): Promise<Message | null> {
        if (this.parent instanceof Message) return this.parent.edit(options);
        return null;
    }

    /**
     * @interaction Edits the initial reply to this interaction
     * @message Edits the client's first reply to this message
     * @param {string|MessagePayload|WebhookEditMessageOptions|MessageEditOptions} options
     * The new options for the message
     * @returns {Promise<Message|APIMessage|null|undefined>}
     */
    public async editReply(
        options: string | MessagePayload | WebhookEditMessageOptions | MessageEditOptions,
    ): Promise<Message | APIMessage | null | undefined> {
        if (!this.replied && !this.deferred)
            throw new Error('The reply to this context has not been sent or deferred.');

        if (this.parent instanceof Message) {
            if (this.replied) {
                const reply = this[_replies].first();
                return reply?.edit(options);
            } else if (this.deferred) {
                return this[_reply](options as any);
            }
            return undefined;
        }
        return this.parent.editReply(options as any);
    }

    /**
     * @interaction Always returns false
     * @message Used mainly internally. Whether two messages are identical
     * in properties. If you want to compare messages without checking all
     * the properties, use message.id === message2.id, which is much more
     * efficient. This method allows you to see if there are differences in
     * content, embeds, attachments, nonce and tts properties.
     * @param {Context|Other} other
     * @returns {boolean}
     */
    public equals(other: Context | Message): boolean {
        if (this.parent instanceof Message && other instanceof Message) {
            return this.parent.equals(other, void 0);
        } else if (
            this.parent instanceof Message &&
            other instanceof Context &&
            other.parent instanceof Message
        ) {
            return this.parent.equals(other.parent, void 0);
        }

        return false;
    }

    /**
     * @interaction Always returns null
     * @message Fetch this message
     * @param {boolean} force Whether to skip the cache check and request the API
     */
    public async fetch(force: boolean): Promise<Message | null> {
        if (this.parent instanceof Message) {
            return this.parent.fetch(force);
        }
        return null;
    }

    /**
     * @interaction Always returns null
     * @message Fetches the Message this crosspost/reply/pin-add references, if available to the client
     * @returns {Promise<Message|null>}
     */
    public async fetchReference(): Promise<Message | null> {
        if (this.parent instanceof Message) {
            return this.parent.fetchReference();
        }
        return null;
    }

    /**
     * @interaction Returns the interactions webhook, if any
     * @message Fetches the webhook used to create this message
     * @returns {Promise<Webhook|InteractionWebhook|null>}
     */
    public async fetchWebhook(): Promise<Webhook | InteractionWebhook | null> {
        if (this.parent instanceof Message) {
            return this.parent.fetchWebhook();
        }
        return this.webhook;
    }

    /**
     * @interaction Fetches the initial reply to this interaction
     * @message Fetches the client's first reply to this message
     * @returns {Promise<Message|APIMessage|undefined>}
     */
    public async fetchReply(): Promise<Message | APIMessage | undefined> {
        if (!this.replied && !this.deferred)
            throw new Error('The reply to this context has not been sent or deferred.');

        if (this.parent instanceof Message) {
            if (this.replied) {
                const replyId = this[_replies].keys().next().value;
                const channel = this.channel ?? (await this.client.channels.fetch(this.channelId));
                const reply = await Reflect.get(channel ?? {}, 'messages')?.fetch(replyId);
                return reply;
            }
            return undefined;
        }
        return this.parent.fetchReply();
    }

    /**
     * @interaction Send a follow-up message to this interaction
     * @message Sends another reply to this message
     * @param {string|MessagePayload|ReplyOptions|InteractionReplyOptions} options Send a
     * follow-up message to this interaction.
     * @returns {Promise<Message|APIMessage|InteractionResponse|null>}
     */
    public async followUp(
        options: string | MessagePayload | ReplyMessageOptions | InteractionReplyOptions,
    ): Promise<Message | APIMessage> {
        if (!this.replied && !this.deferred)
            throw new Error('The reply to this context has not been sent or deferred.');

        if (this.parent instanceof Message) {
            return this[_reply](options as any);
        }
        return this.parent.followUp(options as any);
    }

    /**
     * @interaction Indicates whether this interaction is received from a guild
     * @message Whether this message is from a guild
     * @returns {boolean}
     */
    public inGuild(): boolean {
        return this.parent.inGuild();
    }

    /**
     * @interaction Indicates whether or not this interaction is both cached and received from a guild
     * @message Whether this message is from a guild and it is cached
     * @returns {boolean}
     */
    public inCachedCached(): boolean {
        return Boolean(this.inGuild() && this.guild);
    }

    /**
     * @interaction Indicates whether or not this interaction is received from an uncached guild
     * @message Whether this message is from a guild abd it is uncached
     * @returns {boolean}
     */
    public inRawGuild(): boolean {
        return Boolean(this.guildId && !this.guild && this.member);
    }

    /**
     * @interaction Indicates whether this interaction is an {@link AutocompleteInteraction}
     * @message Always returns false
     * @returns {boolean}
     */
    public isAutocomplete(): boolean {
        return Reflect.get(this.parent, 'isAutocomplete')?.() ?? false;
    }

    /**
     * @interaction Indicates whether this interaction is a {@link MessageComponentInteraction}
     * @message Always returns false
     * @returns {boolean}
     */
    public isMessageComponent(): boolean {
        return Reflect.get(this.parent, 'isMessageComponent')?.() ?? false;
    }

    /**
     * @interaction Indicates whether this interaction is a {@link ButtonInteraction}
     * @message Always returns false
     * @returns {boolean}
     */
    public isButton(): boolean {
        return Reflect.get(this.parent, 'isButton')?.() ?? false;
    }

    /**
     * @interaction Indicates whether this interaction is a {@link SelectMenuInteraction}
     * @message Always returns false
     * @returns {boolean}
     */
    public isSelectMenu(): boolean {
        return Reflect.get(this.parent, 'isSelectMenu')?.() ?? false;
    }

    /**
     * @interaction Indicates whether this interaction can be replied to
     * @message Always returns true
     * @returns {boolean}
     */
    public isRepliable(): boolean {
        return this.parent instanceof ChatInputCommandInteraction
            ? Reflect.get(this.parent, 'isRepliable')()
            : this.channel instanceof GuildChannel &&
              this.guild instanceof Guild &&
              this.guild.me instanceof GuildMember
            ? this.channel?.permissionsFor(this.guild.me)?.has('SendMessages')
            : true;
    }

    /**
     * @interaction Always returns false
     * @message Pins this message to the channel's pinned messages.
     * @param {string} [reason] Reason for pinning
     * @returns {Promise<boolean>}
     */
    public async pin(reason?: string): Promise<boolean> {
        if (this.parent instanceof Message) {
            await this.parent.pin(reason);
            return true;
        }
        return false;
    }

    /**
     * @interaction Always returns false
     * @message Unpins this message from the channel's pinned messages.
     * @param {string} [reason] Reason for unpinning
     * @returns {Promise<boolean>}
     */
    public async unpin(reason?: string): Promise<boolean> {
        if (this.parent instanceof Message) {
            await this.parent.unpin(reason);
            return true;
        }
        return false;
    }

    /**
     * @interaction Always returns false
     * @message Adds a reaction to the message
     * @param {EmojiIdentifierResolvable} emoji The emoji to react with
     * @returns {Promise<MessageReaction|null>}
     */
    public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction | null> {
        return Reflect.get(this.parent, 'react')?.(emoji) ?? null;
    }

    /**
     * @interaction Always returns void
     * @message Removes the attachments from this message
     * @returns {Promise<null>}
     */
    public removeAttachments(): Promise<null> {
        return Reflect.get(this.parent, 'removeAttachments')?.() ?? null;
    }

    /**
     * @interaction Creates a reply to this interaction
     * @message Send an inline reply to this message
     * @param {string|MessagePayload|ReplyMessageOptions|InteractionReplyOptions} options The options
     * to provide
     * @returns {Promise<Message | APIMessage>}
     */
    public async reply(
        options: string | MessagePayload | ReplyMessageOptions | InteractionReplyOptions,
    ): Promise<Message | APIMessage> {
        if (this.deferred || this.replied)
            throw new Error('This context has already been replied to.');

        if (this.parent instanceof Message) return this[_reply](options as any);
        return this.parent.followUp(options as any);
    }

    /**
     * @interaction Always returns null
     * @message Resolves a component by a custom id
     * @param {string} customId The custom id to resolve against
     * @returns {MessageComponent | null}
     */
    public resolveComponent(customId: string): MessageActionRowComponent | null {
        return Reflect.get(this.parent, 'resolveComponent')?.(customId) ?? null;
    }

    /**
     * @interaction Start a thread in the same channel as this interaction
     * @message Create a new public thread from this message
     * @param {ThreadCreateOptions} options Options for starting a thread
     * @returns {Promise<ThreadChannel|undefined>}
     */
    public async startThread(
        options: ThreadCreateOptions<any>,
    ): Promise<ThreadChannel | undefined> {
        if (this.parent instanceof Message) {
            return this.parent.startThread(options);
        } else if (this.channel instanceof TextChannel) {
            return this.channel.threads.create(options);
        }
        return undefined;
    }

    /**
     * @interaction Always returns null
     * @message Suppresses or unsuppresses embeds on a message
     * @param {boolean} suppress If the embeds should be suppressed or not
     * @returns {Promise<null>}
     */
    public suppressEmbeds(suppress: boolean): Promise<null> {
        return Reflect.get(this.parent, 'suppressEmbeds')?.(suppress) ?? null;
    }

    /**
     * @interaction Shows a modal component
     * @message Always returns null
     * @param {ModalData|ModalBuilder} modal The modal to show
     * @returns {Promise<null|undefined>}
     */
    public async showModal(modal: ModalData | ModalBuilder): Promise<null | undefined> {
        if (this.parent instanceof Message) return null;
        await this.parent.showModal(modal);
        return undefined;
    }

    /**
     * @interaction Returns a string representation of the command
     * interaction, this can then be copied by a user and executed again
     * in a new command while keeping the option order.
     * @message When concatenated with a string, this automatically
     * concatenates the message's content instead of the object
     */
    public toString(): string {
        return this.parent.toString();
    }

    private async [_reply](
        options: string | MessagePayload | ReplyMessageOptions,
    ): Promise<Message | APIMessage> {
        return (this.parent as Message).reply(options).then((reply: any) => {
            this[_replies].set(reply.id, reply ?? null);
            return Promise.resolve(reply);
        });
    }
}
