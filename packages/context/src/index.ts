import type { APIModalInteractionResponseCallbackData } from 'discord-api-types/v10';
import {
    ApplicationCommandOptionType,
    Attachment,
    AwaitMessageComponentOptions,
    AwaitModalSubmitOptions,
    AwaitReactionsOptions,
    ChatInputCommandInteraction,
    Collection,
    CommandInteractionOption,
    CommandInteractionOptionResolver,
    DMChannel,
    EmojiIdentifierResolvable,
    Guild,
    GuildChannel,
    GuildMember,
    GuildTextBasedChannel,
    InteractionDeferReplyOptions,
    InteractionReplyOptions,
    JSONEncodable,
    Message,
    MessageComponentCollectorOptions,
    MessageEditOptions,
    MessageFlagsBitField,
    MessageMentions,
    MessagePayload,
    ModalComponentData,
    NewsChannel,
    ReactionCollectorOptions,
    ReactionManager,
    ReplyMessageOptions,
    Snowflake,
    TextBasedChannel,
    TextChannel,
    ThreadChannel,
    ThreadCreateOptions,
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
    public get activity() {
        return this.parent instanceof Message ? this.parent.activity : null;
    }

    /**
     * @interaction The client application id
     * @message The client application id
     */
    public get applicationId() {
        return this.parent.applicationId;
    }

    /**
     * @interaction Set of permissions the application or bot has within the channel the interaction was sent from
     * @message The permissions the clients guild member has in the channel the message was sent in
     */
    public get appPermissions() {
        if (this.parent instanceof ChatInputCommandInteraction) return this.parent.appPermissions;

        const me = this.guild?.members.me;
        const channel = this.channel as GuildTextBasedChannel;
        if (!me || !channel) return null;
        return me.permissionsIn(channel);
    }

    /**
     * @interaction A collection of attachments in the interaction options, mapped by their option name
     * @message A collection of attachments in the message, mapped by id
     */
    public get attachments() {
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
    public get author() {
        return this.parent instanceof Message ? this.parent.author : this.parent.user;
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
    public get cleanContent() {
        return this.parent instanceof Message ? this.parent.cleanContent : this.parent.toString();
    }

    /**
     * @interaction The id of the channel the interaction was evoked in
     * @message The id of the channel the message was sent in
     */
    public get channelId() {
        return this.parent.channelId;
    }

    /**
     * @interaction The client that instantiated this
     * @message The client that instantiated this
     */
    public get client() {
        return this.parent.client;
    }

    /**
     * @interaction The invoked application command, if it was fetched before
     * @message Always null
     */
    public get command() {
        return this.parent instanceof Message ? null : this.parent.command;
    }

    /**
     * @interaction The invoked application command's id
     * @message An empty string
     */
    public get commandId() {
        return this.parent instanceof Message ? '' : this.parent.commandId;
    }

    /**
     * @interaction The invoked application command's name
     * @message An empty string
     */
    public get commandName() {
        return this.parent instanceof Message ? '' : this.parent.commandName;
    }

    /**
     * @interaction The invoked application command's type
     * @message 0
     */
    public get commandType() {
        return this.parent instanceof Message ? 0 : this.parent.commandType;
    }

    /**
     * @interaction An empty array
     * @message A list of ActionRows in the message
     */
    public get components() {
        return this.parent instanceof Message ? this.parent.components : [];
    }

    /**
     * @interaction Returns a string representation of the command interaction
     * @message The content of the message
     */
    public get content() {
        return this.parent instanceof Message ? this.parent.content : this.parent.toString();
    }

    /**
     * @interaction The time the interaction was created at
     * @message The time the message was sent at
     */
    public get createdAt() {
        return this.parent.createdAt;
    }

    /**
     * @interaction The timestamp the interaction was created at
     * @message The timestamp the message was sent at
     */
    public get createdTimestamp() {
        return this.parent.createdTimestamp;
    }

    /**
     * @interaction Always false
     * @message Whether the message is crosspostable by the client user
     */
    public get crosspostable() {
        return this.parent instanceof Message ? this.parent.crosspostable : false;
    }

    /**
     * @interaction Whether the reply to this interaction has been deferred
     * @message Whether the client sent typing to the message's channel
     */
    public get deferred() {
        return this.parent instanceof Message ? this[_deferred] : this.parent.deferred;
    }

    /**
     * @interaction Always false
     * @message Whether the message is deletable by the client user
     */
    public get deletable() {
        return this.parent instanceof Message ? this.parent.deletable : false;
    }

    /**
     * @interaction Always false
     * @message Whether the message is editable by the client user
     */
    public get editable() {
        return this.parent instanceof Message ? this.parent.editable : false;
    }

    /**
     * @interaction Always null
     * @message The time the message was last edited at (if applicable)
     */
    public get editedAt() {
        return this.parent instanceof Message ? this.parent.editedAt : null;
    }

    /**
     * @interaction Always null
     * @message The timestamp the message was last edited at (if applicable)
     */
    public get editedTimestamp() {
        return this.parent instanceof Message ? this.parent.editedTimestamp : null;
    }

    /**
     * @interaction An empty array
     * @message A list of embeds in the message - e.g. YouTube Player
     */
    public get embeds() {
        return this.parent instanceof Message ? this.parent.embeds : [];
    }

    /**
     * @interaction Whether the reply to this interaction is ephemeral
     * @message Always false
     */
    public get ephemeral() {
        return this.parent instanceof Message ? false : this.parent.ephemeral;
    }

    /**
     * @interaction Always empty bitfield
     * @message Flags that are applied to the message
     */
    public get flags() {
        return this.parent instanceof Message ? this.parent.flags : new MessageFlagsBitField(0);
    }

    /**
     * @interaction Always null
     * @message Supplemental application information for group activities
     */
    public get groupActivityApplication() {
        return this.parent instanceof Message ? this.parent.groupActivityApplication : null;
    }

    /**
     * @interaction The guild this interaction was sent in
     * @message The guild the message was sent in (if in a guild channel)
     */
    public get guild() {
        return this.parent.guild;
    }

    /**
     * @interaction The id of the guild this interaction was sent in
     * @message The id of the guild the message was sent in, if any
     */
    public get guildId() {
        return this.parent.guildId;
    }

    /**
     * @interaction The preferred locale from the guild this interaction was sent in
     * @message The perferred locale of the guild this message was send in, if any
     */
    public get guildLocale() {
        return this.parent instanceof Message
            ? this.guild?.preferredLocale
            : this.parent.guildLocale;
    }

    /**
     * @interaction Always false
     * @message Whether this message has a thread associated with it
     */
    public get hasThread() {
        return this.parent instanceof Message ? this.parent.hasThread : false;
    }

    /**
     * @interaction The interaction's id
     * @message The message's id
     */
    public get id() {
        return this.parent.id;
    }

    /**
     * @interaction Always null
     * @message Partial data of the interaction that this message is a reply to
     */
    public get interaction() {
        return this.parent instanceof Message ? this.parent.interaction : this.parent;
    }

    /**
     * @interaction The locale of the user who invoked this interaction
     * @message Always null
     */
    public get locale() {
        return this.parent instanceof Message ? null : this.parent.locale;
    }

    /**
     * @interaction If this interaction was sent in a guild, the member which sent it
     * @message Represents the author of the message as a guild member. Only available if the message
     * comes from a guild where the author is still a member
     */
    public get member() {
        return this.parent.member;
    }

    /**
     * @interaction The permissions of the member, if one exists, in the channel this interaction was
     * executed in
     * @message The permissions of the member, in the channel this message was sent in, if applicable
     */
    public get memberPermissions() {
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
    public get mentions() {
        return this.parent instanceof Message
            ? this.parent.mentions
            : // @ts-ignore Access private class
              new MessageMentions(this.parent);
    }

    /**
     * @interaction Always null
     * @message A random number or string used for checking message delivery,
     * this is only received after the message was sent successfully, and lost if re-fetched
     */
    public get nonce() {
        return this.parent instanceof Message ? this.parent.nonce : null;
    }

    /**
     * @interaction The options passed to the command
     * @message Always an empty CommandInteractionOptionResolver object
     */
    public get options() {
        return this.parent instanceof Message
            ? // @ts-ignore Access a private class
              new CommandInteractionOptionResolver(this.client, [], {})
            : this.parent.options;
    }

    /**
     * @interaction Always false
     * @message Whether or not this message is a partial
     */
    public get partial() {
        return this.parent instanceof Message ? this.parent.partial : false;
    }

    /**
     * @interaction Always false
     * @message Whether the message is pinnable by the client user
     */
    public get pinnable() {
        return this.parent instanceof Message ? this.parent.pinnable : false;
    }

    /**
     * @interaction Always false
     * @message Whether or not this message is pinned
     */
    public get pinned() {
        return this.parent instanceof Message ? this.parent.pinned : false;
    }

    /**
     * @interaction Always an empty ReactionManager object
     * @message A manager of the reactions belonging to this message
     */
    public get reactions() {
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
    public get reference() {
        return this.parent instanceof Message ? this.parent.reference : null;
    }

    /**
     * @interaction Whether this interaction has already been replied to
     * @message Whether the client has already replied to the message
     */
    public get replied() {
        return this.parent instanceof Message ? this[_replied] : this.parent.replied;
    }

    /**
     * @interaction Always an empty Collection object
     * @message A collection of stickers in the message
     */
    public get stickers() {
        return this.parent instanceof Message ? this.parent.stickers : new Collection();
    }

    /**
     * @interaction Always false
     * @message Whether or not this message was sent by Discord, not actually a
     * user (e.g. pin notifications)
     */
    public get system() {
        return this.parent instanceof Message ? this.parent.system : false;
    }

    /**
     * @interaction Always null
     * @message The thread started by this message
     */
    public get thread() {
        return this.parent instanceof Message ? this.parent.thread : null;
    }

    /**
     * @interaction The interaction's token
     * @message An empty string
     */
    public get token() {
        return this.parent instanceof Message ? '' : this.parent.token;
    }

    /**
     * @interaction Always false
     * @message Whether or not the message was Text-To-Speech
     */
    public get tts() {
        return this.parent instanceof Message ? this.parent.tts : false;
    }

    /**
     * @interaction The interaction's type
     * @message The type of the message
     */
    public get type() {
        return this.parent.type;
    }

    /**
     * @interaction An empty string
     * @message The URL to jump to this message
     */
    public get url() {
        return this.parent instanceof Message ? this.parent.url : '';
    }

    /**
     * @interaction The user which sent this interaction
     * @message The author of the message
     */
    public get user() {
        return this.author;
    }

    /**
     * @interaction The version
     * @message Always 0
     */
    public get version() {
        return this.parent instanceof Message ? 0 : this.parent.version;
    }

    /**
     * @interaction An associated interaction webhook, can be used to further
     * interact with this
     * interaction
     * @message Always null
     */
    public get webhook() {
        return this.parent instanceof Message ? null : this.parent.webhook;
    }

    /**
     * @interaction The id of the associated interaction webhook
     * @message The id of the webhook that sent the message, if applicable
     */
    public get webhookId() {
        return this.parent instanceof Message ? this.parent.webhookId : null;
    }

    /**
     * @interaction Always returns null
     * @message Collects a single component interaction that passes the filter
     * The Promise will reject if the time expires
     * @param {AwaitMessageComponentOptions} [options={}] Options to pass to the
     * internal collector
     */
    public async awaitMessageComponent(options: AwaitMessageComponentOptions<any> = {}) {
        if (this.parent instanceof ChatInputCommandInteraction) return null;
        return this.parent.awaitMessageComponent(options as any);
    }

    /**
     * @interaction Collects a single modal submit interaction that passes the
     * filter. The Promise will reject if the time expires
     * @message Always returns null
     * @param {AwaitModalSubmitOptions} [options] Options to pass to the
     * internal collector
     */
    public async awaitModalSubmit(options: AwaitModalSubmitOptions<any>) {
        if (this.parent instanceof Message) return null;
        return this.parent.awaitModalSubmit(options);
    }

    /**
     * @interaction Always returns null
     * @message Similar to createReactionCollector but in promise form
     * Resolves with a collection of reactions that pass the specified filter
     * @param {AwaitReactionsOptions} [options={}] Optional options to pass to
     * the internal collector
     */
    public async awaitReactions(options: AwaitReactionsOptions = {}) {
        if (this.parent instanceof ChatInputCommandInteraction) return null;
        return this.parent.awaitReactions(options);
    }

    /**
     * @interaction Always returns null
     * @message Creates a message component interaction collector
     * @param {MessageComponentCollectorOptions} [options={}] Options to send to
     * the collector
     */
    public createMessageComponentCollector(options: MessageComponentCollectorOptions<any> = {}) {
        if (this.parent instanceof ChatInputCommandInteraction) return null;
        return this.parent.createMessageComponentCollector(options as any);
    }

    /**
     * @interaction Always returns null
     * @message Creates a reaction collector
     * @param {ReactionCollectorOptions} [options={}] Options to send to the
     * collector
     */
    public createReactionCollector(options: ReactionCollectorOptions = {}) {
        if (this.parent instanceof ChatInputCommandInteraction) return null;
        return this.parent.createReactionCollector(options);
    }

    /**
     * @interaction Always returns null
     * @message Publishes a message in an announcement channel to all channels
     * following it
     */
    public async crosspost() {
        if (this.parent instanceof ChatInputCommandInteraction) return null;
        return this.parent.crosspost();
    }

    /**
     * @interaction Defers the reply to this interaction
     * @message Starts typing in the channel this message was sent in
     * @param {InteractionDeferReplyOptions} [options={}] Options for deferring
     * the reply to this interaction
     */
    public async deferReply(options: InteractionDeferReplyOptions = {}) {
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
     */
    public async delete() {
        return this.parent instanceof Message ? this.parent.delete() : null;
    }

    /**
     * @interaction Deletes the initial reply to this interaction
     * @message Deletes the client's first reply to this message
     */
    public async deleteReply() {
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
     */
    public async edit(options: string | MessagePayload | MessageEditOptions) {
        return this.parent instanceof Message ? this.parent.edit(options) : null;
    }

    /**
     * @interaction Edits the initial reply to this interaction
     * @message Edits the client's first reply to this message
     * @param {string|MessagePayload|WebhookEditMessageOptions|MessageEditOptions} options
     * The new options for the message
     */
    public async editReply(
        options: string | MessagePayload | WebhookEditMessageOptions | MessageEditOptions,
    ) {
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
     * content, embeds, attachments, nonce and tts properties
     * @param {Context|Other} other
     */
    public equals(other: Context | Message) {
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
    public async fetch(force: boolean) {
        return this.parent instanceof Message ? this.parent.fetch(force) : null;
    }

    /**
     * @interaction Always returns null
     * @message Fetches the Message this crosspost/reply/pin-add references, if available to the client
     */
    public async fetchReference() {
        return this.parent instanceof Message ? this.parent.fetchReference() : null;
    }

    /**
     * @interaction Returns the interactions webhook, if any
     * @message Fetches the webhook used to create this message
     */
    public async fetchWebhook() {
        return this.parent instanceof Message ? this.parent.fetchWebhook() : null;
    }

    /**
     * @interaction Fetches the initial reply to this interaction
     * @message Fetches the client's first reply to this message
     */
    public async fetchReply() {
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
     */
    public followUp(
        options: string | MessagePayload | ReplyMessageOptions | InteractionReplyOptions,
    ) {
        if (!this.replied && !this.deferred)
            throw new Error('The reply to this context has not been sent or deferred.');

        return this.parent instanceof Message
            ? this[_reply](options as any)
            : this.parent.followUp(options as any);
    }

    /**
     * @interaction Indicates whether this interaction is received from a guild
     * @message Whether this message is from a guild
     */
    public inGuild() {
        return this.parent.inGuild();
    }

    /**
     * @interaction Indicates whether or not this interaction is both cached and received from a guild
     * @message Whether this message is from a guild and it is cached
     */
    public inCachedCached() {
        return Boolean(this.inGuild() && this.guild);
    }

    /**
     * @interaction Indicates whether or not this interaction is received from an uncached guild
     * @message Whether this message is from a guild abd it is uncached
     */
    public inRawGuild() {
        return Boolean(this.guildId && !this.guild && this.member);
    }

    /**
     * @interaction Indicates whether this interaction is a {@link ButtonInteraction}
     * @message Always returns false
     */
    public isButton() {
        return this.parent instanceof Message ? false : this.parent.isButton();
    }

    /**
     * @interaction Indicates whether this interaction is a {@link ChatInputCommandInteraction}
     * @message Always returns false
     */
    public isChatInputCommand() {
        return this.parent instanceof Message ? false : this.parent.isChatInputCommand();
    }

    /**
     * @interaction Indicates whether this interaction is a {@link ContextMenuCommandInteraction}
     * @message Always returns false
     */
    public isContextMenuCommand() {
        return this.parent instanceof Message ? false : this.parent.isContextMenuCommand();
    }

    /**
     * @interaction Indicates whether this interaction is a {@link MessageContextMenuCommandInteraction}
     * @message Always returns false
     */
    public isMessageContextMenuCommand() {
        return this.parent instanceof Message ? false : this.parent.isMessageContextMenuCommand();
    }

    /**
     * @interaction Indicates whether this interaction can be replied to
     * @message Always returns true
     */
    public isRepliable() {
        return this.parent instanceof ChatInputCommandInteraction
            ? this.parent.isRepliable()
            : this.channel instanceof GuildChannel &&
              this.guild instanceof Guild &&
              this.guild.members.me instanceof GuildMember
            ? this.channel?.permissionsFor(this.guild.members.me)?.has('SendMessages')
            : true;
    }

    /**
     * @interaction Indicates whether this interaction is a {@link SelectMenuInteraction}
     * @message Always returns false
     */
    public isSelectMenu() {
        return this.parent instanceof Message ? false : this.parent.isSelectMenu();
    }

    /**
     * @interaction Always returns false
     * @message Pins this message to the channel's pinned messages
     * @param {string} [reason] Reason for pinning
     */
    public async pin(reason?: string) {
        if (this.parent instanceof Message) {
            await this.parent.pin(reason);
            return true;
        }
        return false;
    }

    /**
     * @interaction Always returns false
     * @message Unpins this message from the channel's pinned messages
     * @param {string} [reason] Reason for unpinning
     */
    public async unpin(reason?: string) {
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
     */
    public react(emoji: EmojiIdentifierResolvable) {
        return this.parent instanceof Message ? this.parent.react(emoji) : Promise.resolve(null);
    }

    /**
     * @interaction Always returns void
     * @message Removes the attachments from this message
     */
    public removeAttachments() {
        return this.parent instanceof Message
            ? this.parent.removeAttachments()
            : Promise.resolve(null);
    }

    /**
     * @interaction Creates a reply to this interaction
     * @message Send an inline reply to this message
     * @param {string|MessagePayload|ReplyMessageOptions|InteractionReplyOptions} options The options
     * to provide
     */
    public async reply(
        options: string | MessagePayload | ReplyMessageOptions | InteractionReplyOptions,
    ) {
        if (this.deferred || this.replied)
            throw new Error('This context has already been replied to.');

        if (this.parent instanceof Message) return this[_reply](options as any);
        return this.parent.reply(options as any);
    }

    /**
     * @interaction Always returns null
     * @message Resolves a component by a custom id
     * @param {string} customId The custom id to resolve against
     */
    public resolveComponent(customId: string) {
        return this.parent instanceof Message ? this.parent.resolveComponent(customId) : null;
    }

    /**
     * @interaction Start a thread in the same channel as this interaction
     * @message Create a new public thread from this message
     * @param {ThreadCreateOptions} options Options for starting a thread
     */
    public async startThread(options: ThreadCreateOptions<any>) {
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
     */
    public suppressEmbeds(suppress: boolean) {
        return this.parent instanceof Message
            ? this.parent.suppressEmbeds(suppress)
            : Promise.resolve(null);
    }

    /**
     * @interaction Shows a modal component and returns undefined
     * @message Always returns null
     * @param {APIModal|ModalData|Modal} modal The modal to show
     */
    public async showModal(
        modal:
            | APIModalInteractionResponseCallbackData
            | ModalComponentData
            | JSONEncodable<APIModalInteractionResponseCallbackData>,
    ) {
        return this.parent instanceof Message ? null : void (await this.parent.showModal(modal));
    }

    /**
     * @interaction Returns a string representation of the command
     * interaction, this can then be copied by a user and executed again
     * in a new command while keeping the option order
     * @message When concatenated with a string, this automatically
     * concatenates the message's content instead of the object
     */
    public toString() {
        return this.parent.toString();
    }

    private async [_reply](
        options: string | MessagePayload | ReplyMessageOptions,
    ): Promise<Message> {
        return (this.parent as Message).reply(options).then((reply: any) => {
            this[_replies].set(reply.id, reply ?? null);
            return Promise.resolve(reply);
        });
    }
}
