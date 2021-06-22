<?php

namespace WebApps\Apps\StaffDirectory\Commands;

use Illuminate\Console\Command;
use WebApps\Apps\StaffDirectory\Models\Person;

class StaffDirectoryDeleteTrash extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'StaffDirectory:delete-trash';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Person::onlyTrashed()->where('deleted_at', '<', date('Y-m-d H:i:s', strtotime("-30 days")))->forceDelete();
        $this->info('Trashed records deleted');
        return 0;
    }
}
