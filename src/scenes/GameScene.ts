import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { NPC } from '../objects/NPC'
import { GAME_WIDTH, GAME_HEIGHT } from '../config'

export class GameScene extends Phaser.Scene {
  private player!: Player
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private npcs: NPC[] = []
  private interactKey!: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.createOffice()
    this.createPlayer()
    this.createNPCs()
    this.setupInput()
    this.setupCamera()

    this.scene.launch('UIScene')
  }

  private createOffice() {
    const tileSize = 64
    const cols = Math.ceil(GAME_WIDTH * 1.5 / tileSize)
    const rows = Math.ceil(GAME_HEIGHT * 1.5 / tileSize)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const isWall = y === 0 || y === rows - 1 || x === 0 || x === cols - 1
        const texture = isWall ? 'wall' : 'floor'
        this.add.sprite(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, texture)
      }
    }

    this.createOfficeObjects()
  }

  private createOfficeObjects() {
    const deskStyle = { fillStyle: { color: 0x8b7355 } }
    
    for (let i = 0; i < 5; i++) {
      const desk = this.add.graphics(deskStyle)
      desk.fillRect(150 + i * 150, 200, 100, 60)
      desk.fillRect(150 + i * 150, 180, 100, 20)
    }

    const coffee = this.add.graphics({ fillStyle: { color: 0x4a3728 } })
    coffee.fillRect(700, 500, 80, 100)
    
    const coffeeLabel = this.add.text(740, 550, '☕', { fontSize: '32px' })
    coffeeLabel.setOrigin(0.5)
  }

  private createPlayer() {
    this.player = new Player(this, 200, 400)
    this.add.existing(this.player)
  }

  private createNPCs() {
    const timLead = new NPC(
      this,
      600,
      300,
      'timlead',
      'Тим Лид',
      'Senior Developer',
      [
        {
          id: 'intro',
          lines: [
            {
              speaker: 'Тим Лид',
              text: 'Привет, новенький! Добро пожаловать в команду.',
            },
            {
              speaker: 'Тим Лид',
              text: 'Твоя первая задача — найди документацию по проекту. Она где-то на кухне.',
              choices: [
                { text: 'Понял, иду искать!', nextDialogue: 'accepted', respectChange: 5 },
                { text: 'А можно поподробнее?', nextDialogue: 'details', stressChange: -5 },
              ],
            },
          ],
        },
        {
          id: 'accepted',
          lines: [
            {
              speaker: 'Тим Лид',
              text: 'Отлично! Удачи. И не забудь выпить кофе — он бесплатный.',
            },
          ],
        },
        {
          id: 'details',
          lines: [
            {
              speaker: 'Тим Лид',
              text: 'Документация лежит на столе на кухне. Бывает, что её прячут в холодильник.',
            },
            {
              speaker: 'Тим Лид',
              text: 'Так что ищи тщательно. Удачи!',
            },
          ],
        },
      ]
    )

    const hrManager = new NPC(
      this,
      900,
      400,
      'hr',
      'Анна HR',
      'HR Manager',
      [
        {
          id: 'hr-intro',
          lines: [
            {
              speaker: 'Анна HR',
              text: 'Привет! Я Анна, HR-менеджер. Если будут вопросы по отпуску — обращайся.',
            },
            {
              speaker: 'Анна HR',
              text: 'Как ты себя чувствуешь? Не слишком много стресса?',
              choices: [
                { text: 'Всё отлично, спасибо!', nextDialogue: 'hr-good', respectChange: 5 },
                { text: 'Если честно, немного устал...', nextDialogue: 'hr-tired', stressChange: -10 },
                { text: 'Я в порядке (ложь)', nextDialogue: 'hr-lie', stressChange: 10 },
              ],
            },
          ],
        },
        {
          id: 'hr-good',
          lines: [
            {
              speaker: 'Анна HR',
              text: 'Отлично! Продолжай в том же духе! 🌟',
            },
          ],
        },
        {
          id: 'hr-tired',
          lines: [
            {
              speaker: 'Анна HR',
              text: 'Понимаю. Не забывай делать перерывы и пить кофе.',
            },
            {
              speaker: 'Анна HR',
              text: 'Можешь взять отгул, если нужно. Береги себя!',
            },
          ],
        },
        {
          id: 'hr-lie',
          lines: [
            {
              speaker: 'Анна HR',
              text: 'Хм... Ладно, но если что — приходи.',
            },
            {
              speaker: 'Анна HR',
              text: '(Про себя) Надо будет присмотреть за ним...',
            },
          ],
        },
      ]
    )

    this.npcs.push(timLead, hrManager)
    this.npcs.forEach((npc) => this.add.existing(npc))
  }

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)
  }

  private setupCamera() {
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, GAME_WIDTH * 1.5, GAME_HEIGHT * 1.5)
  }

  update() {
    if (this.player) {
      this.player.update(this.cursors)
    }

    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.checkInteraction()
    }
  }

  private checkInteraction() {
    for (const npc of this.npcs) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.x,
        npc.y
      )

      if (distance < 80) {
        this.startDialogue(npc)
        break
      }
    }
  }

  private startDialogue(npc: NPC) {
    this.scene.pause()
    this.scene.get('UIScene').events.emit('startDialogue', npc.getDialogue())
  }
}
